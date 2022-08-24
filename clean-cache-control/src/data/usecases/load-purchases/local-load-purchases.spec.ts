import { LocalLoadPurchases } from '..';
import { CacheStoreSpy } from '../../tests';

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
  it('1. Should not delete or insert cache on sut.init', () => {
    const { cacheStore } = makeSut()

    expect(cacheStore.actions).toEqual([])
  })

  it('2. Should call correct key on load', async () => {
    const { cacheStore, sut } = makeSut()
    await sut.loadAll()

    expect(cacheStore.actions).toEqual([CacheStoreSpy.Action.fetch])
    expect(cacheStore.fetchKey).toBe('purchases')
  })

  it('3. Should return empty list if load fails', async () => {
    const { cacheStore, sut } = makeSut()
    cacheStore.helperSimulateFetchError()
    const purchases = await sut.loadAll()

    expect(cacheStore.actions).toEqual([CacheStoreSpy.Action.fetch, CacheStoreSpy.Action.delete])
    expect(cacheStore.deleteKey).toBe('purchases')
    expect(purchases).toEqual([])
  })

})
