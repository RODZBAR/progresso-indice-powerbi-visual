"use strict";

import powerbi from "powerbi-visuals-api";
import { formattingSettings } from "powerbi-visuals-utils-formattingmodel";

import Card = formattingSettings.SimpleCard;
import Model = formattingSettings.Model;
import ValidatorType = powerbi.visuals.ValidatorType;

const FONTE_PADRAO = "Segoe UI, sans-serif";

function tamanhoFonte(name: string, valor: number): formattingSettings.NumUpDown {
    return new formattingSettings.NumUpDown({
        name,
        displayName: "Tamanho",
        value: valor,
        options: {
            minValue: { type: ValidatorType.Min, value: 6 },
            maxValue: { type: ValidatorType.Max, value: 120 }
        }
    });
}

function controleFonte(negritoPadrao: boolean, tamanho: number): formattingSettings.FontControl {
    return new formattingSettings.FontControl({
        name: "font",
        displayName: "Fonte",
        fontFamily: new formattingSettings.FontPicker({ name: "fontFamily", value: FONTE_PADRAO }),
        fontSize: tamanhoFonte("fontSize", tamanho),
        bold: new formattingSettings.ToggleSwitch({ name: "fontBold", value: negritoPadrao }),
        italic: new formattingSettings.ToggleSwitch({ name: "fontItalic", value: false }),
        underline: new formattingSettings.ToggleSwitch({ name: "fontUnderline", value: false })
    });
}

/* ----------------------- Cartao (fundo) ----------------------- */
class CartaoCard extends Card {
    corFundo = new formattingSettings.ColorPicker({
        name: "corFundo",
        displayName: "Cor de fundo",
        value: { value: "#252729" }
    });
    raio = new formattingSettings.NumUpDown({
        name: "raio",
        displayName: "Arredondamento das bordas",
        value: 12,
        options: {
            minValue: { type: ValidatorType.Min, value: 0 },
            maxValue: { type: ValidatorType.Max, value: 80 }
        }
    });
    name = "cartao";
    displayName = "Cartao (fundo)";
    slices = [this.corFundo, this.raio];
}

/* ------------------ Campo 1 - Resultado/Meta (topo) ------------------ */
class TopoCard extends Card {
    font = controleFonte(true, 32);
    cor = new formattingSettings.ColorPicker({
        name: "cor",
        displayName: "Cor",
        value: { value: "#FFFFFF" }
    });
    prefixo = new formattingSettings.TextInput({
        name: "prefixo",
        displayName: "Prefixo (rotulo)",
        value: "",
        placeholder: "ex.: Pontos "
    });
    separador = new formattingSettings.TextInput({
        name: "separador",
        displayName: "Separador Resultado/Meta",
        value: "/",
        placeholder: "/"
    });
    sufixo = new formattingSettings.TextInput({
        name: "sufixo",
        displayName: "Sufixo",
        value: " pts",
        placeholder: " pts"
    });
    name = "topo";
    displayName = "Campo 1 - Resultado/Meta (topo)";
    slices = [this.font, this.cor, this.prefixo, this.separador, this.sufixo];
}

/* ------------------ Campo 2 - Peso ------------------ */
class PesoCard extends Card {
    rotulo = new formattingSettings.TextInput({
        name: "rotulo",
        displayName: "Rotulo",
        value: "Peso: ",
        placeholder: "Peso: "
    });
    font = controleFonte(false, 32);
    cor = new formattingSettings.ColorPicker({
        name: "cor",
        displayName: "Cor",
        value: { value: "#A0A0A0" }
    });
    name = "peso";
    displayName = "Campo 2 - Peso";
    slices = [this.rotulo, this.font, this.cor];
}

/* ------------------ Posicao (data) ------------------ */
class PosicaoCard extends Card {
    rotulo = new formattingSettings.TextInput({
        name: "rotulo",
        displayName: "Rotulo",
        value: "Posicao: ",
        placeholder: "Posicao: "
    });
    font = controleFonte(false, 32);
    cor = new formattingSettings.ColorPicker({
        name: "cor",
        displayName: "Cor",
        value: { value: "#A0A0A0" }
    });
    name = "posicao";
    displayName = "Posicao (data)";
    slices = [this.rotulo, this.font, this.cor];
}

/* ------------------ Campo 3 - Resultado/Atingimento (barra) ------------------ */
class ResultadoBarraCard extends Card {
    rotulo = new formattingSettings.TextInput({
        name: "rotulo",
        displayName: "Rotulo (esquerda)",
        value: "Resultado",
        placeholder: "Resultado"
    });
    corRotulo = new formattingSettings.ColorPicker({
        name: "corRotulo",
        displayName: "Cor do rotulo",
        value: { value: "#A0A0A0" }
    });
    font = controleFonte(true, 32);
    corValor = new formattingSettings.ColorPicker({
        name: "corValor",
        displayName: "Cor do valor",
        value: { value: "#FFFFFF" }
    });
    textoMeio = new formattingSettings.TextInput({
        name: "textoMeio",
        displayName: "Texto entre Resultado e Atingimento",
        value: " pts | ",
        placeholder: " pts | "
    });
    textoFim = new formattingSettings.TextInput({
        name: "textoFim",
        displayName: "Texto final",
        value: " atg.",
        placeholder: " atg."
    });
    name = "resultadoBarra";
    displayName = "Campo 3 - Resultado/Atingimento (barra)";
    slices = [this.rotulo, this.corRotulo, this.font, this.corValor, this.textoMeio, this.textoFim];
}

/* ------------------ Campo 4 - Barra de progresso ------------------ */
class BarraCard extends Card {
    corAtingido = new formattingSettings.ColorPicker({
        name: "corAtingido",
        displayName: "Cor (meta atingida)",
        value: { value: "#5FA198" }
    });
    corNaoAtingido = new formattingSettings.ColorPicker({
        name: "corNaoAtingido",
        displayName: "Cor (abaixo da meta)",
        value: { value: "#D2666A" }
    });
    corFundoBarra = new formattingSettings.ColorPicker({
        name: "corFundoBarra",
        displayName: "Cor de fundo da barra",
        value: { value: "#000000" }
    });
    limite = new formattingSettings.NumUpDown({
        name: "limite",
        displayName: "Limite para 'atingido' (%)",
        value: 100,
        options: {
            minValue: { type: ValidatorType.Min, value: 0 },
            maxValue: { type: ValidatorType.Max, value: 1000 }
        }
    });
    segmentos = new formattingSettings.NumUpDown({
        name: "segmentos",
        displayName: "Numero de segmentos",
        value: 4,
        options: {
            minValue: { type: ValidatorType.Min, value: 1 },
            maxValue: { type: ValidatorType.Max, value: 20 }
        }
    });
    altura = new formattingSettings.NumUpDown({
        name: "altura",
        displayName: "Altura da barra",
        value: 18,
        options: {
            minValue: { type: ValidatorType.Min, value: 2 },
            maxValue: { type: ValidatorType.Max, value: 60 }
        }
    });
    name = "barra";
    displayName = "Campo 4 - Barra de progresso";
    slices = [this.corAtingido, this.corNaoAtingido, this.corFundoBarra, this.limite, this.segmentos, this.altura];
}

/* ------------------ Campo 5 - Meta (barra) ------------------ */
class MetaBarraCard extends Card {
    rotulo = new formattingSettings.TextInput({
        name: "rotulo",
        displayName: "Rotulo (esquerda)",
        value: "Meta",
        placeholder: "Meta"
    });
    corRotulo = new formattingSettings.ColorPicker({
        name: "corRotulo",
        displayName: "Cor do rotulo",
        value: { value: "#A0A0A0" }
    });
    font = controleFonte(true, 32);
    corValor = new formattingSettings.ColorPicker({
        name: "corValor",
        displayName: "Cor do valor",
        value: { value: "#FFFFFF" }
    });
    sufixo = new formattingSettings.TextInput({
        name: "sufixo",
        displayName: "Sufixo",
        value: " pts",
        placeholder: " pts"
    });
    name = "metaBarra";
    displayName = "Campo 5 - Meta (barra)";
    slices = [this.rotulo, this.corRotulo, this.font, this.corValor, this.sufixo];
}

/* ------------------ Numeros (global) ------------------ */
class NumeroCard extends Card {
    casasDecimais = new formattingSettings.NumUpDown({
        name: "casasDecimais",
        displayName: "Casas decimais",
        value: 2,
        options: {
            minValue: { type: ValidatorType.Min, value: 0 },
            maxValue: { type: ValidatorType.Max, value: 6 }
        }
    });
    fracaoPercentual = new formattingSettings.ToggleSwitch({
        name: "fracaoPercentual",
        displayName: "Percentuais como fracao (0 a 1)",
        value: true
    });
    virgulaDecimal = new formattingSettings.ToggleSwitch({
        name: "virgulaDecimal",
        displayName: "Usar virgula como separador decimal",
        value: true
    });
    name = "numero";
    displayName = "Numeros (formatacao)";
    slices = [this.casasDecimais, this.fracaoPercentual, this.virgulaDecimal];
}

export class VisualFormattingSettingsModel extends Model {
    cartao = new CartaoCard();
    topo = new TopoCard();
    peso = new PesoCard();
    posicao = new PosicaoCard();
    resultadoBarra = new ResultadoBarraCard();
    barra = new BarraCard();
    metaBarra = new MetaBarraCard();
    numero = new NumeroCard();

    cards = [
        this.cartao,
        this.topo,
        this.peso,
        this.posicao,
        this.resultadoBarra,
        this.barra,
        this.metaBarra,
        this.numero
    ];
}
