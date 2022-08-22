import { LocalSavePurchases } from '..';
import { mockPurchases, CacheStoreSpy } from '../../tests';

type SutTypes = {
  sut: LocalSavePurchases
  cacheStore: CacheStoreSpy
}

const makeSut = (timestamp = new Date()): SutTypes => {
  const cacheStore = new CacheStoreSpy()
  const sut = new LocalSavePurchases(cacheStore, timestamp)

  return {
    sut,
    cacheStore
  }
}

describe('LocalSavePurchases', () => {
  it('1. Should not delete or insert cache on sut.init', () => {
    const { cacheStore } = makeSut()

    expect(cacheStore.actions).toEqual([])
  })

  it('2. Should not insert new Cache if delete fails', async () => {
    const { cacheStore, sut } = makeSut()
    cacheStore.helperSimulateDeteleError()
    const promise = sut.save(mockPurchases())

    expect(cacheStore.actions).toEqual([CacheStoreSpy.Action.delete])
    await expect(promise).rejects.toThrow()
  })

  it('3. Should insert new Cache if delete succeeds', async () => {
    const timestamp = new Date()
    const { cacheStore, sut } = makeSut(timestamp)
    const purchases = mockPurchases()
    const promise = sut.save(purchases)

    expect(cacheStore.actions).toEqual([CacheStoreSpy.Action.delete, CacheStoreSpy.Action.insert])
    expect(cacheStore.insertKey).toBe('purchases')
    expect(cacheStore.deleteKey).toBe('purchases')
    expect(cacheStore.insertValues).toEqual({
      timestamp,
      value: purchases
    })
    await expect(promise).resolves.toBeFalsy()
  })

  it('4. Should throw if insert throws', async () => {
    const { cacheStore, sut } = makeSut()
    cacheStore.helperSimulateInsertError()
    const promise = sut.save(mockPurchases())

    expect(cacheStore.actions).toEqual([CacheStoreSpy.Action.delete, CacheStoreSpy.Action.insert])
    await expect(promise).rejects.toThrow()
  })
})
