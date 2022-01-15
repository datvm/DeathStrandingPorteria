import { CompletionStatusCount, dsData } from "../Services/DataService.js";
const FilterCompletionIdPrefix = "chk-filter-completion-";
const FilterStorageKey = "filters";
export class FilterPanel extends HTMLElement {
    frmFilter = this.querySelector(".frm-filter");
    cboLocationType = this.querySelector(".cbo-filter-loc-type");
    cboLocation = this.querySelector(".cbo-filter-loc");
    lstCompletion = this.querySelector(".list-filter-completion");
    constructor() {
        super();
        this.frmFilter.addEventListener("submit", e => {
            e.preventDefault();
            this.applyFilterAsync();
        });
        this.cboLocationType.addEventListener("change", () => this.onLocTypeChanged());
    }
    async init() {
        const locations = dsData.locationList;
        if (!locations) {
            throw new Error("No data.");
        }
        this.initLocations(locations);
        this.initCompletionList();
        await this.initSavedSettingsAsync();
        this.querySelector(".btn-clear")?.addClick(() => void this.onClearFilter());
    }
    async onClearFilter() {
        await this.setFilterStorageAsync();
        await this.initSavedSettingsAsync();
        await this.applyFilterAsync();
    }
    initLocations(locs) {
        locs = locs.slice(0).sort((a, b) => a.name.localeCompare(b.name));
        const frag = new DocumentFragment();
        for (const loc of locs) {
            const opt = frag.createElement("option");
            opt.value = loc.id.toString();
            opt.text = loc.name;
        }
        this.cboLocation.setContent(frag);
    }
    initCompletionList() {
        const template = this.lstCompletion.querySelector("template").innerHTML;
        const frag = new DocumentFragment();
        for (let i = 0; i < CompletionStatusCount; i++) {
            const el = template.toElement();
            frag.appendChild(el);
            const id = FilterCompletionIdPrefix + i;
            el.querySelector("input").setAttribute("id", id);
            el.querySelector("label").setAttribute("for", id);
            el.querySelector("img").setAttribute("src", dsData.getCompletionImageUrl(i));
            el.setChildContent(".name", dsData.getCompletionText(i));
        }
        this.lstCompletion.setContent(frag);
    }
    async initSavedSettingsAsync() {
        const filters = await this.getFilterStorageAsync();
        this.cboLocationType.value = filters.locType.toString();
        if (filters.locId) {
            this.cboLocation.value = filters.locId.toString() || "";
        }
        for (let i = 0; i < CompletionStatusCount; i++) {
            this.querySelector("#" + FilterCompletionIdPrefix + i)
                .checked = Boolean(filters.completions[i]);
        }
        this.onLocTypeChanged();
    }
    onLocTypeChanged() {
        this.cboLocation.disabled = this.cboLocationType.value === "0";
    }
    async applyFilterAsync() {
        const filter = this.filters;
        await this.setFilterStorageAsync(filter);
        this.dispatchEvent(new CustomEvent("filter-request", {
            bubbles: true,
            cancelable: true,
            detail: filter,
        }));
    }
    async getFilterStorageAsync() {
        const raw = localStorage.getItem(FilterStorageKey);
        if (raw) {
            return JSON.parse(raw);
        }
        else {
            return this.defaultFilter;
        }
    }
    async setFilterStorageAsync(filter) {
        if (filter) {
            localStorage.setItem(FilterStorageKey, JSON.stringify(filter));
        }
        else {
            localStorage.removeItem(FilterStorageKey);
        }
    }
    get defaultFilter() {
        return {
            locType: 0,
            locId: 0,
            completions: { 0: true, 1: true, 2: true, 3: true, 4: true, }
        };
    }
    get filters() {
        const completions = {};
        for (let i = 0; i < CompletionStatusCount; i++) {
            completions[i] = this.lstCompletion.querySelector("#" + FilterCompletionIdPrefix + i).checked;
        }
        return {
            locType: Number(this.cboLocationType.value),
            locId: Number(this.cboLocation.value),
            completions,
        };
    }
    static register() {
        customElements.define("order-filter", this);
    }
}
//# sourceMappingURL=FilterPanel.js.map