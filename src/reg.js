
export const svgReg = /glyph glyph-name="(?<name>[^"]+)" unicode="(?<unicode>[^"]+)" d="(?<path>[^"]+)"\s{2}horiz-adv-x="(?<size>[^"]+)" \/>/g

export const jsReg = /<symbol id="(?<name>[^"]+)" viewBox="(?<viewBox>[^"]+)">(?<path>(<path[^>]+><\/path>)+)<\/symbol>/g

export const jsPathReg = /<path d="(?<d>[^"]+)"\s*><\/path>/g
