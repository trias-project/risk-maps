export interface OverlayConf {
  url: string;
  name: string;
  keyProperty: string,
  nameProperty: string
}

export interface SpeciesSelectOption {
  text: string,
  value: number
}

export interface SpeciesConfigEntry {
  text: string,
  value: number,
  hasOccurrenceData: boolean, 
  hasModellingData: boolean
}

export interface FormRadioOption {
  text: string,
  value: string,
  disabled: boolean
}