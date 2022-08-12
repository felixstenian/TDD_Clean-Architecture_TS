import { CacheStore } from '@/data/protocols/cache';
import { LocalSavePurchases } from '..';

class CacheStoreSpy implements CacheStore {
  deleteCallsCount = 0
  key: string
  
  delete(key: string): void {
    this.deleteCallsCount++
    this.key = key
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

    expect(cacheStore?.deleteCallsCount).toBe(0)
  })

  it('2. Should delete old cache on sut.save and with correct key', async () => {
    const { sut, cacheStore } = makeSut()
    await sut.save()

    expect(cacheStore?.deleteCallsCount).toBe(1)
    expect(cacheStore?.key).toBe('purchases')
  })
})
