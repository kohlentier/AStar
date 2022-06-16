'use strict'

const BinaryHeap = require('./BinaryHeap.class.js')

class AStar {
  constructor (grid) {
    this.grid = grid
    this.gridXMax = grid.length
    this.gridYMax = grid[0].length
    this.usedCells = []
    this.binaryHeap = new BinaryHeap((element) => { return element.f })

    this.initCellDetails()
  }

  initCellDetails () {
    this.cellDetails = Array.from({length: this.gridXMax}, value => Array.from({length: this.gridYMax}, value => { return {} }))

    for (let i = 0; i < this.gridXMax; i++) {
      for (let j = 0; j < this.gridYMax; j++) {
        this.cellDetails[i][j] = {
          x: i,
          y: j,
          f: Number.MAX_VALUE,
          g: Number.MAX_VALUE,
          h: false,
          isClosed: false,
          isBlocked: this.grid[i][j] === 0,
          parent: null,
          onOpenList: false
        }
      }
    }
  }

  resetUsedCells () {
    for (let i = 0, length = this.usedCells.length; i < length; i++) {
      this.usedCells[i].f = Number.MAX_VALUE
      this.usedCells[i].g = Number.MAX_VALUE
      this.usedCells[i].h = false
      this.usedCells[i].isClosed = false
      this.usedCells[i].parent = null
      this.usedCells[i].onOpenList = false
    }

    this.usedCells = []
  }

  isValidCell (x, y) {
    return x >= 0 && x < this.gridXMax && y >= 0 && y < this.gridYMax
  }

  isUnBlockedCell (x, y) {
    return this.grid[x][y] >= 0
  }

  isDestination (x, y) {
    return x === this.destination.x && y === this.destination.y
  }

  calculateHValue (x, y) {
    // return Math.sqrt((x - this.destination.x) * (x - this.destination.x) + (y - this.destination.y) * (y - this.destination.y))
    return Math.abs(x - this.destination.x) + Math.abs(y - this.destination.y)
  }

  calculateDiagonalCellNeighbour (currentCell, neighbourCell) {
    if (!neighbourCell.isBlocked && !neighbourCell.isClosed) {
      this.usedCells.push(neighbourCell)
      neighbourCell.h = neighbourCell.h || this.calculateHValue(neighbourCell.x, neighbourCell.y)
      let newG = this.grid[currentCell.x][currentCell.y] * 1.4142 + currentCell.g

      if (newG <= neighbourCell.g) {
        neighbourCell.parent = currentCell
        neighbourCell.g = newG

        if (!neighbourCell.onOpenList) {
          neighbourCell.onOpenList = true
          neighbourCell.f = neighbourCell.g + neighbourCell.h
          // this.openList.push(neighbourCell)
          this.binaryHeap.insert(neighbourCell)
        }
      }
    }
  }

  calculateCellNeighbour (currentCell, neighbourCell) {
    if (!neighbourCell.isBlocked && !neighbourCell.isClosed) {
      this.usedCells.push(neighbourCell)
      neighbourCell.h = neighbourCell.h || this.calculateHValue(neighbourCell.x, neighbourCell.y)
      let newG = this.grid[currentCell.x][currentCell.y] + currentCell.g

      if (newG <= neighbourCell.g) {
        neighbourCell.parent = currentCell
        neighbourCell.g = newG

        if (!neighbourCell.onOpenList) {
          neighbourCell.onOpenList = true
          neighbourCell.f = neighbourCell.g + neighbourCell.h
          // this.openList.push(neighbourCell)
          this.binaryHeap.insert(neighbourCell)
        }
      }
    }
  }

  getPath (start, destination) {
    let path = []

    this.destination = destination
    this.usedCells.push(this.cellDetails[start.x][start.y])
    this.cellDetails[start.x][start.y].g = 0

    // this.openList = [this.cellDetails[start.x][start.y]]
    this.binaryHeap.insert(this.cellDetails[start.x][start.y])
    let found = false
    let neighbourCell, currentCell

    // while (this.openList.length) {
    while (this.binaryHeap.length) {
      // this.openList.sort((a, b) => a.f - b.f)
      // currentCell = this.openList.shift()
      currentCell = this.binaryHeap.extractMin()

      if (this.isDestination(currentCell.x, currentCell.y)) {
        found = true
        break
      }

      currentCell.isClosed = true

      // NORTH-WEST
      if (this.isValidCell(currentCell.x - 1, currentCell.y - 1)) {
        neighbourCell = this.cellDetails[currentCell.x - 1][currentCell.y - 1]
        this.calculateDiagonalCellNeighbour(currentCell, neighbourCell)
      }

      // NORTH
      if (this.isValidCell(currentCell.x - 1, currentCell.y)) {
        neighbourCell = this.cellDetails[currentCell.x - 1][currentCell.y]
        this.calculateCellNeighbour(currentCell, neighbourCell)
      }

      // NORTH-EAST
      if (this.isValidCell(currentCell.x - 1, currentCell.y + 1)) {
        neighbourCell = this.cellDetails[currentCell.x - 1][currentCell.y + 1]
        this.calculateDiagonalCellNeighbour(currentCell, neighbourCell)
      }

      // WEST
      if (this.isValidCell(currentCell.x, currentCell.y - 1)) {
        neighbourCell = this.cellDetails[currentCell.x][currentCell.y - 1]
        this.calculateCellNeighbour(currentCell, neighbourCell)
      }

      // EAST
      if (this.isValidCell(currentCell.x, currentCell.y + 1)) {
        neighbourCell = this.cellDetails[currentCell.x][currentCell.y + 1]
        this.calculateCellNeighbour(currentCell, neighbourCell)
      }

      // SOUTH-WEST
      if (this.isValidCell(currentCell.x + 1, currentCell.y - 1)) {
        neighbourCell = this.cellDetails[currentCell.x + 1][currentCell.y - 1]
        this.calculateDiagonalCellNeighbour(currentCell, neighbourCell)
      }

      // SOUTH
      if (this.isValidCell(currentCell.x + 1, currentCell.y)) {
        neighbourCell = this.cellDetails[currentCell.x + 1][currentCell.y]
        this.calculateCellNeighbour(currentCell, neighbourCell)
      }

      // SOUTH-EAST
      if (this.isValidCell(currentCell.x + 1, currentCell.y + 1)) {
        neighbourCell = this.cellDetails[currentCell.x + 1][currentCell.y + 1]
        this.calculateDiagonalCellNeighbour(currentCell, neighbourCell)
      }
    }

    if (found) {
      path = this.buildPath()
    } else {
      console.log('no path found')
    }

    this.resetUsedCells()
    this.binaryHeap.reset()

    return path
  }

  buildPath () {
    let cell = this.cellDetails[this.destination.x][this.destination.y]
    let path = []

    while (cell.parent) {
      path.push({x: cell.x, y: cell.y})
      cell = cell.parent
    }

    return path.reverse()
  }
}

module.exports = AStar
