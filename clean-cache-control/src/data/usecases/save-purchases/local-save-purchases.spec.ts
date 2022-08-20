import { CacheStore } from '@/data/protocols/cache';
import { SavePurchases } from '@/domain/usecases';
import { LocalSavePurchases } from '..';
import { mockPurchases } from '../../tests';

class CacheStoreSpy implements CacheStore {
  deleteCallsCount = 0
  insertCallsCount = 0
  deleteKey: string
  insertKey: string
  insertValues: SavePurchases.Params[] = []
  
  delete(key: string): void {
    this.deleteCallsCount++
    this.deleteKey = key
  }

  insert(key: string, value: any): void {
    this.insertCallsCount++
    this.insertKey = key
    this.insertValues = value
  }

  helperSimulateDeteleError (): void {
    jest.spyOn(CacheStoreSpy.prototype, 'delete').mockImplementationOnce(() => { throw new Error() })
  }

  helperSimulateInsertError (): void {
    jest.spyOn(CacheStoreSpy.prototype, 'insert').mockImplementationOnce(() => { throw new Error() })
  }
}

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
  it('1. Should not delete cache on sut.init', () => {
    const { cacheStore } = makeSut()

    expect(cacheStore.deleteCallsCount).toBe(0)
  })

  it('2. Should delete old cache on sut.save and with correct key', async () => {
    const { cacheStore, sut } = makeSut()
    await sut.save(mockPurchases())

    expect(cacheStore.deleteCallsCount).toBe(1)
    expect(cacheStore.deleteKey).toBe('purchases')
  })

  it('3. Should not insert new Cache if delete fails', () => {
    const { cacheStore, sut } = makeSut()
    cacheStore.helperSimulateDeteleError()
    const promise = sut.save(mockPurchases())

    expect(cacheStore.insertCallsCount).toBe(0)    
    expect(promise).rejects.toThrow()
  })

  it('4. Should insert new Cache if delete succeeds', async () => {
    const { cacheStore, sut } = makeSut()
    const purchases = mockPurchases()
    await sut.save(purchases)

    expect(cacheStore.deleteCallsCount).toBe(1) 
    expect(cacheStore.insertCallsCount).toBe(1)
    expect(cacheStore.insertKey).toBe('purchases')
    expect(cacheStore.insertValues).toEqual(purchases)
  })

  it('5. Should throw if insert throws', () => {
    const { cacheStore, sut } = makeSut()
    cacheStore.helperSimulateInsertError()
    const promise = sut.save(mockPurchases())

    expect(promise).rejects.toThrow()
  })
})
