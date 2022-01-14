#pragma warning disable CS8618 // Non-nullable field must contain a non-null value when exiting constructor. Consider declaring as nullable.
namespace DeathStrandingPorteria.ExtractionScript;

public class OrderInfo
{

    public int Id { get; set; }
    public string Name { get; set; }

    public int StartLocationId { get; set; }
    public int DestLocationId { get; set; }
    public int CategoryId { get; set; }

    public IEnumerable<OrderRequirement> ReqStandard { get; set; }
    public IEnumerable<OrderRequirement> ReqPremium { get; set; }

    public IEnumerable<int> Tags { get; set; }

    public int MaxLike { get; set; }
    public int MaxLikePremium { get; set; }

    public int WeightX10 { get; set; }
    public Dictionary<string, int> Sizes { get; set; }
}

public enum CargoSize
{
    S = 1,
    M = 2,
    L = 4,
    XL = 6,
}

public class OrderRequirement
{
    public OrderRequirementType ReqType { get; set; }
    public int ValueX10 { get; set; }
    public string? Unit { get; set; }
}

public enum OrderRequirementType
{
    TimeLimit = 0,
    Quantity = 1,
    MinWeight = 2,
    Condition = 3,
}

public class EnumEntry
{
    public EnumEntry(int id, string name)
    {
        this.Id = id;
        this.Name = name;
    }

    public int Id { get; set; }
    public string Name { get; set; }

    public static List<EnumEntry> Get<TEnum>() where TEnum : struct, Enum
    {
        return Enum.GetValues<TEnum>()
            .Select(q => new EnumEntry((int)(object)q, q.ToString()))
            .ToList();
    }

}

public class Location
{
    static int UniqueId = 0;

    public Location(string name)
    {
        this.Name = name;
    }

    public int Id { get; set; } = UniqueId++;
    public string Name { get; set; }
}

public class OrderCategory
{
    static int UniqueId = 0;

    public OrderCategory(string name)
    {
        this.Name = name;
    }

    public int Id { get; set; } = UniqueId++;
    public string Name { get; set; }
}

public class OrderTag
{
    static int UniqueId = 0;

    public OrderTag(string name)
    {
        this.Name = name;
    }

    public int Id { get; set; } = UniqueId++;
    public string Name { get; set; }
}