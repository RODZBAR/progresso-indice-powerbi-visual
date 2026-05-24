"use strict";

import powerbi from "powerbi-visuals-api";
import { FormattingSettingsService } from "powerbi-visuals-utils-formattingmodel";
import { VisualFormattingSettingsModel } from "./settings";

import IVisual = powerbi.extensibility.visual.IVisual;
import VisualConstructorOptions = powerbi.extensibility.visual.VisualConstructorOptions;
import VisualUpdateOptions = powerbi.extensibility.visual.VisualUpdateOptions;
import IVisualHost = powerbi.extensibility.visual.IVisualHost;
import DataView = powerbi.DataView;
import VisualTooltipDataItem = powerbi.extensibility.VisualTooltipDataItem;

const SVGNS = "http://www.w3.org/2000/svg";
const VIEW_W = 817;
const VIEW_H = 321;
const BAR_TOTAL_W = 737;
const BAR_GAP = 19;

function el(tag: string, attrs: { [k: string]: string | number }): SVGElement {
    const e = document.createElementNS(SVGNS, tag) as SVGElement;
    for (const k in attrs) {
        const v = attrs[k];
        if (v !== null && v !== undefined) {
            e.setAttribute(k, String(v));
        }
    }
    return e;
}

function txt(attrs: { [k: string]: string | number }, content: string): SVGElement {
    const t = el("text", attrs);
    t.textContent = content;
    return t;
}

function fmtNum(v: any, dec: number, virgula: boolean): string {
    if (v === null || v === undefined || v === "" || isNaN(Number(v))) {
        return "";
    }
    let s = Number(v).toFixed(dec);
    if (virgula) {
        s = s.replace(".", ",");
    }
    return s;
}

function fmtPct(v: any, dec: number, virgula: boolean, fracao: boolean): string {
    if (v === null || v === undefined || v === "" || isNaN(Number(v))) {
        return "";
    }
    const n = Number(v) * (fracao ? 100 : 1);
    let s = n.toFixed(dec);
    if (virgula) {
        s = s.replace(".", ",");
    }
    return s + "%";
}

function fontAttrs(font: any, forcarPeso?: string): { [k: string]: string | number } {
    return {
        "font-family": font.fontFamily.value,
        "font-size": font.fontSize.value,
        "font-weight": forcarPeso ? forcarPeso : (font.bold && font.bold.value ? "700" : "400"),
        "font-style": font.italic && font.italic.value ? "italic" : "normal",
        "text-decoration": font.underline && font.underline.value ? "underline" : "none"
    };
}

export class Visual implements IVisual {
    private host: IVisualHost;
    private target: HTMLElement;
    private svg: SVGElement;
    private formattingSettingsService: FormattingSettingsService;
    private formattingSettings: VisualFormattingSettingsModel;
    private tooltipItems: VisualTooltipDataItem[] = [];

    constructor(options: VisualConstructorOptions) {
        this.host = options.host;
        this.formattingSettingsService = new FormattingSettingsService();
        this.target = options.element;
        this.target.classList.add("progresso-indice-host");

        this.svg = el("svg", {
            viewBox: `0 0 ${VIEW_W} ${VIEW_H}`,
            preserveAspectRatio: "xMidYMid meet"
        });
        this.target.appendChild(this.svg);

        this.svg.addEventListener("mousemove", (e: MouseEvent) => {
            if (!this.tooltipItems.length) {
                return;
            }
            const rect = this.target.getBoundingClientRect();
            this.host.tooltipService.show({
                coordinates: [e.clientX - rect.left, e.clientY - rect.top],
                dataItems: this.tooltipItems,
                identities: [],
                isTouchEvent: false
            });
        });
        this.svg.addEventListener("mouseleave", () => {
            this.host.tooltipService.hide({ immediately: true, isTouchEvent: false });
        });
    }

    public update(options: VisualUpdateOptions): void {
        const dataView: DataView = options.dataViews && options.dataViews[0];
        this.formattingSettings = this.formattingSettingsService.populateFormattingSettingsModel(
            VisualFormattingSettingsModel,
            dataView
        );

        if (options.viewport) {
            this.svg.setAttribute("width", String(options.viewport.width));
            this.svg.setAttribute("height", String(options.viewport.height));
        }

        while (this.svg.firstChild) {
            this.svg.removeChild(this.svg.firstChild);
        }

        this.render(dataView);
    }

    private getVal(columns: powerbi.DataViewMetadataColumn[], row: any[], role: string): any {
        const idx = columns.findIndex(c => c.roles && (c.roles as any)[role]);
        return idx >= 0 ? row[idx] : null;
    }

    private formatData(v: any): string {
        if (v === null || v === undefined) {
            return "";
        }
        if (v instanceof Date) {
            return v.toLocaleDateString("pt-BR");
        }
        return String(v);
    }

    private formatAny(v: any, dec: number, virgula: boolean): string {
        if (v === null || v === undefined) {
            return "";
        }
        if (v instanceof Date) {
            return this.formatData(v);
        }
        if (typeof v === "number") {
            return fmtNum(v, dec, virgula);
        }
        return String(v);
    }

    private render(dataView: DataView): void {
        const s = this.formattingSettings;
        const dec = s.numero.casasDecimais.value;
        const virgula = s.numero.virgulaDecimal.value;
        const fracao = s.numero.fracaoPercentual.value;

        // Fundo do cartao
        this.svg.appendChild(el("rect", {
            x: 0, y: 0, width: VIEW_W, height: VIEW_H,
            rx: s.cartao.raio.value,
            fill: s.cartao.corFundo.value.value
        }));

        const table = dataView && dataView.table;
        if (!table || !table.columns || !table.columns.length) {
            this.tooltipItems = [];
            this.svg.appendChild(txt({
                x: 40, y: 60, "font-family": "Segoe UI, sans-serif",
                "font-size": 22, fill: "#888888"
            }, "Adicione os campos no painel de dados."));
            return;
        }

        const columns = table.columns;
        const rows = table.rows || [];
        const row = rows.length ? rows[rows.length - 1] : [];

        const resultadoTopo = this.getVal(columns, row, "resultadoTopo");
        const metaTopo = this.getVal(columns, row, "metaTopo");
        const peso = this.getVal(columns, row, "peso");
        const posicao = this.getVal(columns, row, "posicao");
        const resultadoBarra = this.getVal(columns, row, "resultadoBarra");
        const atingimento = this.getVal(columns, row, "atingimento");
        const progresso = this.getVal(columns, row, "progresso");
        const metaBarra = this.getVal(columns, row, "metaBarra");

        // Tooltips
        this.tooltipItems = columns
            .map((c, i) => ({ c, i }))
            .filter(o => o.c.roles && (o.c.roles as any)["tooltips"])
            .map(o => ({
                displayName: o.c.displayName,
                value: this.formatAny(row[o.i], dec, virgula)
            }) as VisualTooltipDataItem);

        // Campo 1 - Resultado/Meta (topo, esquerda)
        const topoTexto = s.topo.prefixo.value
            + fmtNum(resultadoTopo, dec, virgula)
            + s.topo.separador.value
            + fmtNum(metaTopo, dec, virgula)
            + s.topo.sufixo.value;
        this.svg.appendChild(txt({
            x: 40, y: 50, ...fontAttrs(s.topo.font), fill: s.topo.cor.value.value
        }, topoTexto));

        // Campo 2 - Peso (topo, direita)
        const pesoTexto = s.peso.rotulo.value + fmtPct(peso, dec, virgula, fracao);
        this.svg.appendChild(txt({
            x: 777, y: 50, ...fontAttrs(s.peso.font), fill: s.peso.cor.value.value, "text-anchor": "end"
        }, pesoTexto));

        // Posicao
        const posTexto = s.posicao.rotulo.value + this.formatData(posicao);
        this.svg.appendChild(txt({
            x: 40, y: 100, ...fontAttrs(s.posicao.font), fill: s.posicao.cor.value.value
        }, posTexto));

        // Grupo da barra (translate 40,180)
        const g = el("g", { transform: "translate(40,180)" });

        // Campo 3 - rotulo "Resultado" (esquerda)
        g.appendChild(txt({
            x: 0, y: -35, ...fontAttrs(s.resultadoBarra.font, "400"),
            fill: s.resultadoBarra.corRotulo.value.value
        }, s.resultadoBarra.rotulo.value));

        // Campo 3 - valor "X pts | Y% atg." (direita)
        const valBarra = fmtNum(resultadoBarra, dec, virgula)
            + s.resultadoBarra.textoMeio.value
            + fmtPct(atingimento, dec, virgula, fracao)
            + s.resultadoBarra.textoFim.value;
        g.appendChild(txt({
            x: 737, y: -35, ...fontAttrs(s.resultadoBarra.font),
            fill: s.resultadoBarra.corValor.value.value, "text-anchor": "end"
        }, valBarra));

        // Campo 4 - Barra
        const pNum = Number(progresso);
        const pFraction = (isNaN(pNum) ? 0 : pNum) * (fracao ? 1 : 0.01);
        const thresholdFraction = s.barra.limite.value / 100;
        const corBarra = pFraction >= thresholdFraction
            ? s.barra.corAtingido.value.value
            : s.barra.corNaoAtingido.value.value;

        const segCount = Math.max(1, Math.round(s.barra.segmentos.value));
        let gap = BAR_GAP;
        if ((BAR_TOTAL_W - gap * (segCount - 1)) / segCount < 4) {
            gap = 0;
        }
        const segW = (BAR_TOTAL_W - gap * (segCount - 1)) / segCount;
        const altura = s.barra.altura.value;
        const rx = Math.min(6, altura / 2);
        const band = 1 / segCount;

        for (let i = 0; i < segCount; i++) {
            const x = i * (segW + gap);
            g.appendChild(el("rect", {
                x, y: 0, width: segW, height: altura, rx, fill: s.barra.corFundoBarra.value.value
            }));
            const ratio = (pFraction - i * band) / band;
            const fillW = Math.max(0, Math.min(1, ratio)) * segW;
            if (fillW > 0) {
                g.appendChild(el("rect", {
                    x, y: 0, width: fillW, height: altura, rx, fill: corBarra
                }));
            }
        }

        // Campo 5 - rotulo "Meta" (esquerda)
        g.appendChild(txt({
            x: 0, y: 55, ...fontAttrs(s.metaBarra.font, "400"),
            fill: s.metaBarra.corRotulo.value.value
        }, s.metaBarra.rotulo.value));

        // Campo 5 - valor "X pts" (direita)
        const metaTexto = fmtNum(metaBarra, dec, virgula) + s.metaBarra.sufixo.value;
        g.appendChild(txt({
            x: 737, y: 55, ...fontAttrs(s.metaBarra.font),
            fill: s.metaBarra.corValor.value.value, "text-anchor": "end"
        }, metaTexto));

        this.svg.appendChild(g);
    }

    public getFormattingModel(): powerbi.visuals.FormattingModel {
        return this.formattingSettingsService.buildFormattingModel(this.formattingSettings);
    }
}
