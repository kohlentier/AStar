'use strict'

class BinaryHeap {
  constructor (getKeyFunction) {
    this.heap = []
    this.getKey = getKeyFunction
  }

  get length () { return this.heap.length }

  reset () {
    this.heap = []
  }

  insert (item) {
    this.heap.push(item)
    this.decrease(this.heap.length - 1)
  }

  getMin () {
    return this.heap[0]
  }

  extractMin () {
    return this.remove(0)
  }

  heapify (index) {
    let length = this.heap.length
    let childIndex1, childIndex2, min, temp
    let i = index

    while (true) {
      childIndex1 = (i << 1) + 1
      childIndex2 = childIndex1 + 1
      min = i

      if (childIndex1 < length && this.getKey(this.heap[childIndex1]) < this.getKey(this.heap[min])) {
        min = childIndex1
      }

      if (childIndex2 < length && this.getKey(this.heap[childIndex2]) < this.getKey(this.heap[min])) {
        min = childIndex2
      }

      if (min === i) {
        break
      } else {
        temp = this.heap[min]
        this.heap[min] = this.heap[i]
        this.heap[i] = temp
        // [this.heap[min], this.heap[i]] = [this.heap[i], this.heap[min]]
        i = min
      }
    }
  }

  remove (index) {
    let removedItem = this.heap[index]
    let lastElement = this.heap.pop()

    if (removedItem !== lastElement) {
      this.heap[index] = lastElement

      if (index === 0 || this.getKey(this.heap[index]) > this.getKey(this.heap[(index - 1) >> 1])) {
        this.heapify(index)
      } else {
        this.decrease(index)
      }
    }

    return removedItem
  }

  decrease (index) {
    let parentIndex

    while (index > 0) {
      parentIndex = (index - 1) >> 1

      if (this.getKey(this.heap[index]) < this.getKey(this.heap[parentIndex])) {
        [this.heap[index], this.heap[parentIndex]] = [this.heap[parentIndex], this.heap[index]]
      }

      index = parentIndex
    }
  }
}

module.exports = BinaryHeap
