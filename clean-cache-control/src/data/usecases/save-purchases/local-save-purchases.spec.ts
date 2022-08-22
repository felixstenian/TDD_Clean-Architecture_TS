import { LocalSavePurchases } from '..';
import { mockPurchases, CacheStoreSpy } from '../../tests';

type SutTypes = {
  sut: LocalSavePurchases
  cacheStore: CacheStoreSpy
}

const makeSut = (): SutTypes => {
  const cacheStore = new CacheStoreSpy()
  const sut = new LocalSavePurchases(cacheStore)

  return {
    sut,
    cacheStore
  }
}

describe('LocalSavePurchases', () => {
  it('1. Should not delete or insert cache on sut.init', () => {
    const { cacheStore } = makeSut()

    expect(cacheStore.messages).toEqual([])
  })

  it('2. Should delete old cache on sut.save and with correct key', async () => {
    const { cacheStore, sut } = makeSut()
    await sut.save(mockPurchases())

    expect(cacheStore.messages).toEqual([CacheStoreSpy.Message.delete, CacheStoreSpy.Message.insert])
    expect(cacheStore.deleteKey).toBe('purchases')
  })

  it('3. Should not insert new Cache if delete fails', () => {
    const { cacheStore, sut } = makeSut()
    cacheStore.helperSimulateDeteleError()
    const promise = sut.save(mockPurchases())

    expect(cacheStore.messages).toEqual([CacheStoreSpy.Message.delete])
    expect(promise).rejects.toThrow()
  })

  it('4. Should insert new Cache if delete succeeds', async () => {
    const { cacheStore, sut } = makeSut()
    const purchases = mockPurchases()
    await sut.save(purchases)

    expect(cacheStore.messages).toEqual([CacheStoreSpy.Message.delete, CacheStoreSpy.Message.insert])
    expect(cacheStore.insertKey).toBe('purchases')
    expect(cacheStore.insertValues).toEqual(purchases)
  })

  it('5. Should throw if insert throws', () => {
    const { cacheStore, sut } = makeSut()
    cacheStore.helperSimulateInsertError()
    const promise = sut.save(mockPurchases())

    expect(cacheStore.messages).toEqual([CacheStoreSpy.Message.delete, CacheStoreSpy.Message.insert])
    expect(promise).rejects.toThrow()
  })
})
