export interface SavePurchases {
  save: (purchases: SavePurchases.Params[]) => Promise<void>
  // save: (purchases: Array<SavePurchases.Params>) => Promise<void>
}

export namespace SavePurchases {
  export type Params = {
    id: string
    date: Date
    value: number
  }
}