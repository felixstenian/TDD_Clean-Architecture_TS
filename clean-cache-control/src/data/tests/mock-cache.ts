import { SavePurchases } from '@/domain/usecases'
import { CacheStore } from '../protocols/cache'

export class CacheStoreSpy implements CacheStore {
  actions: CacheStoreSpy.Action[] = []
  deleteKey: string
  insertKey: string
  fetchKey: string
  insertValues: SavePurchases.Params[] = []
  
  delete(key: string): void {
    this.actions.push(CacheStoreSpy.Action.delete)
    this.deleteKey = key
  }

  insert(key: string, value: any): void {
    this.actions.push(CacheStoreSpy.Action.insert)
    this.insertKey = key
    this.insertValues = value
  }
  
  replace(key: string, value: any): void {
    this.delete(key)
    this.insert(key, value)
  }
  
  fetch(key: string): void {
    this.actions.push(CacheStoreSpy.Action.fetch)
    this.fetchKey = key  
  }

  helperSimulateDeteleError (): void {
    jest.spyOn(CacheStoreSpy.prototype, 'delete').mockImplementationOnce(() => { 
      this.actions.push(CacheStoreSpy.Action.delete)
      throw new Error() 
    })
  }

  helperSimulateInsertError (): void {
    jest.spyOn(CacheStoreSpy.prototype, 'insert').mockImplementationOnce(() => { 
      this.actions.push(CacheStoreSpy.Action.insert)
      throw new Error() 
    })
  }

  helperSimulateFetchError (): void {
    jest.spyOn(CacheStoreSpy.prototype, 'fetch').mockImplementationOnce(() => { 
      this.actions.push(CacheStoreSpy.Action.fetch)
      throw new Error() 
    })
  }
}

export namespace CacheStoreSpy {
  export enum Action {
    delete,
    insert,
    fetch
  }
}