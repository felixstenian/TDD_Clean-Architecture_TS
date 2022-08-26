import { LocalLoadPurchases } from '..';
import { CacheStoreSpy, mockPurchases } from '../../tests';

type SutTypes = {
  sut: LocalLoadPurchases
  cacheStore: CacheStoreSpy
}

const makeSut = (timestamp = new Date()): SutTypes => {
  const cacheStore = new CacheStoreSpy()
  const sut = new LocalLoadPurchases(cacheStore, timestamp)

  return {
    sut,
    cacheStore
  }
}

describe('LocalLoadPurchases', () => {
  // Exceptions
  it('1. Should not delete or insert cache on sut.init', () => {
    const { cacheStore } = makeSut()

    expect(cacheStore.actions).toEqual([])
  })

  it('2. Should return empty list if load fails', async () => {
    const { cacheStore, sut } = makeSut()
    cacheStore.helperSimulateFetchError()
    const purchases = await sut.loadAll()

    expect(cacheStore.actions).toEqual([CacheStoreSpy.Action.fetch, CacheStoreSpy.Action.delete])
    expect(cacheStore.deleteKey).toBe('purchases')
    expect(purchases).toEqual([])
  })

  // Success

  it('3. Should return a list of purchases if cache is less than 3 days old', async () => {
    const timestamp = new Date()
    const { cacheStore, sut } = makeSut(timestamp)
    cacheStore.fetchResult = {
      timestamp,
      value: mockPurchases
    }
    const purchases = await sut.loadAll()

    expect(cacheStore.actions).toEqual([CacheStoreSpy.Action.fetch])
    expect(purchases).toEqual(cacheStore.fetchResult.value)
  })

})
