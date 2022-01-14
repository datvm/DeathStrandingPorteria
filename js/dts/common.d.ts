declare global {
    namespace globalThis {
        var sleepAsync: (ms: number) => Promise<void>;
    }

    interface String {

        formatUnicorn(...args: any[]): string;
        toElement(): HTMLElement;
        loc(): string;

    }

    interface Node {

        createElement<TElement extends HTMLElement = HTMLElement>(name: string): TElement;
        getElValue(selector: string): string;
        innerText: string;

        [x: string]: any;

        setChildContent<TElement extends HTMLElement>(selector: string, content: string, isHtml?: boolean): TElement;

        appendScriptAsync(source: string, isModule: boolean): Promise<HTMLScriptElement>;
        addDelegate(eventName: string, cssSelector: string, callback: (e: Event, target: HTMLElement) => void): HTMLElement;
        addClick(handler: EventListenerOrEventListenerObject): HTMLElement;
        loc(): void;
        findAttr(attr: string): string;
        setDisplay(display: boolean): HTMLElement;
        setVisible(visible: boolean): HTMLElement;
        setContent(frag: DocumentFragment, clear?: boolean): HTMLElement;

    }

    interface Array<T> {

        toDict(fn: (item: T) => string): ObjDict<T>;

    }



    type ObjDict<TValue> = { [key: string]: TValue };
}

export { };