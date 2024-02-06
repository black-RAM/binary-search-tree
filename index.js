class Node{
  constructor(data) {
    this.data = data
    this.left = null
    this.right = null
  }
}

class Tree{
  constructor(array) {
    this.root = this.buildTree(array.sort((a, b) => a - b), 0, array.length - 1) 
  }

  buildTree(arr, start, end) {
    if(start > end) return null

    const mid = Math.floor((start + end) / 2)
    const root = new Node(arr[mid])
    root.left = this.buildTree(arr, start, mid - 1)
    root.right = this.buildTree(arr, mid + 1, end)
    return root
  }

  insert(value, node = this.root) {
    if(node == null) {
      return new Node(value) // node inserted as leaf
    }

    if(node.data == value) {
      return node // prevent duplicate
    }

    if(node.data < value) { // keys(left) < key(root) < keys(right)
      node.right = this.insert(value, node.right)
    } else {
      node.left = this.insert(value, node.left)
    }

    return node
  }

  parseTree(node = this.root, prefix = "", isLeft = true) {
    if (node === null) return
    if (node.right !== null) {
      this.parseTree(node.right, `${prefix}${isLeft ? "│   " : "    "}`, false)
    }
    console.log(`${prefix}${isLeft ? "└── " : "┌── "}${node.data}`)
    if (node.left !== null) {
      this.parseTree(node.left, `${prefix}${isLeft ? "    " : "│   "}`, true)
    }
  }
}

const randomNumbers = Array.from({length: 12}, () => parseInt(Math.random() * 100))
const bst = new Tree([50])
for (const number of randomNumbers) {
  bst.insert(number)
}
bst.parseTree()