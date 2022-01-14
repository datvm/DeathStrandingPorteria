using ClosedXML.Excel;
using DeathStrandingPorteria.ExtractionScript;
using System.Text.Json;

const string InputFile = @"D:\Temp\DSOrders.xlsx";
const string OutputFile = @"D:\Temp\DSOrders.json";

using var readStream = File.OpenRead(InputFile);
using var workbook = new XLWorkbook(readStream);
var sheet = workbook.Worksheets.First();

var orders = new List<OrderInfo>();
var lastRow = sheet.LastCellUsed().Address.RowNumber;

var locations = new Dictionary<string, Location>(StringComparer.OrdinalIgnoreCase);
var categories = new Dictionary<string, OrderCategory>(StringComparer.OrdinalIgnoreCase);
var tags = new Dictionary<string, OrderTag>(StringComparer.OrdinalIgnoreCase);

var GetInt = (int row, int col) => Convert.ToInt32(sheet.Cell(row, col).Value);
var GetFloat = (int row, int col) => Convert.ToSingle(sheet.Cell(row, col).Value);
var GetString = (int row, int col) =>
    (sheet.Cell(row, col).Value as string)?.Trim() ?? "";

for (int row = 2; row <= lastRow; row++)
{
    orders.Add(new()
    {
        Id = GetInt(row, 1),
        Name = GetString(row, 2),

        StartLocationId = GetOrCreateLocation(locations, GetString(row, 3)).Id,
        DestLocationId = GetOrCreateLocation(locations, GetString(row, 4)).Id,

        CategoryId = GetOrAdd(categories, GetString(row, 5), (cat) => new(cat)).Id,

        ReqStandard = ParseRequirements(GetString(row, 6)),
        ReqPremium = ParseRequirements(GetString(row, 7)),

        Tags = ParseTags(GetString(row, 8), tags),

        MaxLike = GetInt(row, 9),
        MaxLikePremium = GetInt(row, 10),

        WeightX10 = (int)(GetFloat(row, 11) * 10),
        Sizes = ParseSizes(GetString(row, 12)),
    });
}

using var outStream = File.Create(OutputFile);
var jsonOptions = new JsonSerializerOptions()
{
    PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
    WriteIndented = false,
};

var writingObj = new
{
    orders,
    locations = locations.Values.OrderBy(q => q.Id),
    categories = categories.Values.OrderBy(q => q.Id),
    tags = tags.Values.OrderBy(q => q.Id),
    requirementTypes = EnumEntry.Get<OrderRequirementType>(),
    cargoSizes = EnumEntry.Get<CargoSize>(),
};
await JsonSerializer.SerializeAsync(outStream, writingObj, jsonOptions);

static List<OrderRequirement> ParseRequirements(string raw)
{
    var result = new List<OrderRequirement>();

    var lines = raw.Split('\n');
    foreach (var line in lines)
    {
        if (string.IsNullOrWhiteSpace(line)) { continue; }

        var parts = line.Trim().Split(':');

        var typeRaw = parts[0].Trim();
        var type = typeRaw.Trim().ToLower() switch
        {
            "time limit" => OrderRequirementType.TimeLimit,
            "quantity" => OrderRequirementType.Quantity,
            "min weight" => OrderRequirementType.MinWeight,
            "condition" => OrderRequirementType.Condition,
            _ => throw new ArgumentException("Unknown type: " + typeRaw),
        };

        int valueX10;
        string? unit = null;
        var subParts = parts[1].Trim().Split(' ');

        switch (type)
        {
            case OrderRequirementType.TimeLimit:
                valueX10 = ParseValueX10(subParts[0].Trim());
                unit = subParts[1].Trim();

                break;
            case OrderRequirementType.Quantity:
                valueX10 = ParseValueX10(subParts[0].Trim());

                break;
            case OrderRequirementType.MinWeight:
                unit = "kg";
                valueX10 = ParseValueX10(parts[1].Trim()[..^unit.Length]);

                break;
            case OrderRequirementType.Condition:
                unit = "%";
                valueX10 = ParseValueX10(subParts[2].Trim()[..^1]);

                break;
            default:
                throw new ArgumentException("Unknown value: " + type);
        }

        result.Add(new()
        {
            ReqType = type,
            ValueX10 = valueX10,
            Unit = unit,
        });
    }

    return result;
}

static int ParseValueX10(string value)
{
    return (int)(float.Parse(value) * 10);
}

static List<int> ParseTags(string raw, Dictionary<string, OrderTag> tagDict)
{
    var result = new List<int>();

    var lines = raw.Split('\n');
    foreach (var line in lines)
    {
        if (string.IsNullOrWhiteSpace(line)) { continue; }

        var name = line.Trim();
        // Fix duplicate
        if (name.Equals("Materials", StringComparison.OrdinalIgnoreCase))
        {
            name = "Material";
        }

        result.Add(GetOrAdd(tagDict, name, _ => new(name)).Id);
    }

    return result;
}

static Dictionary<string, int> ParseSizes(string raw)
{
    var result = new Dictionary<string, int>();

    var lines = raw.Split('\n');
    foreach (var line in lines)
    {
        if (string.IsNullOrWhiteSpace(line)) { continue; }

        var parts = line.Split('-');

        var sizeRaw = parts[0].Trim();
        var size = Enum.Parse<CargoSize>(sizeRaw);
        var count = int.Parse(parts[1].Trim());

        result[((int)size).ToString()] = count;
    }

    return result;
}

static Location GetOrCreateLocation(Dictionary<string, Location> locDict, string name)
{
    // Some entry has > for multi dest, last one should be useful
    if (name.Contains('>'))
    {
        name = name.Split('>').Last().Trim();
    }

    return GetOrAdd(locDict, name, _ => new(name));
}

static T GetOrAdd<T>(Dictionary<string, T> dict, string key, Func<string, T> createFn)
{
    if (!dict.TryGetValue(key, out var result))
    {
        dict[key] = result = createFn(key);
    }

    return result;
}