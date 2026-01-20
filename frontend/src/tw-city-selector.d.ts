declare module 'tw-city-selector' {
  interface TwCitySelectorOptions {
    el: HTMLElement | string;
    elCounty: string | HTMLElement;
    elDistrict: string | HTMLElement;
    elZipcode?: string | HTMLElement;
    countyFieldName?: string;
    districtFieldName?: string;
    zipcodeFieldName?: string;
    only?: string[];
    hasZipcode?: boolean;
    standardWords?: boolean;
    bootstrapStyle?: boolean;
    onChange?: (data: {
      county: string;
      district: string;
      zipcode?: string
    }) => void;
  }

  class TwCitySelector {
    constructor(options: TwCitySelectorOptions);
    reset(): void;
    set(data: { county: string; district: string }): void;
    getCounty(): { county: string; district: string; zipcode?: string };
  }

  export default TwCitySelector;
}
