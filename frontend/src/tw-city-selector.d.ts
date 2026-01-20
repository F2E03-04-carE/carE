declare module 'tw-city-selector' {
  interface TwCitySelectorOptions {
    el: HTMLElement
    elCounty: Element | null
    elDistrict: Element | null
    hasZipcode?: boolean
    standardWords?: boolean
  }

  class TwCitySelector {
    constructor(options: TwCitySelectorOptions)
  }

  export default TwCitySelector
}
