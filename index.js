class Node{
  constructor(data) {
    this.data = data
    this.left = null
    this.right = null
  }

  assignSubtree(value) { // left < root < right
    return this.data < value ? "right" : "left"
  }

  hasTwoChildren() {
    return !!this.left && !!this.right
  }

  onlyChild() {
    return this.left == null ? this.right : this.left
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
    if(node == null) return new Node(value) // insert leaf
    const sub = node.assignSubtree(value)
    node[sub] = this.insert(value, node[sub])
    return node
  }

  delete(value, node = this.root) {
    if(node == null) return node
    
    // find node to delete
    if(node.data !== value) {
      const sub = node.assignSubtree(value)
      node[sub] = this.delete(value, node[sub])
      return node
    }

    // node has one child
    if(!node.hasTwoChildren()) {
      const heir = node.onlyChild()
      node = null
      return heir
    }

    // node has two children
    let parent = node
    let successor = node.right

    // leftmost node of right subtree is successor
    while(successor.left !== null) {
      parent = successor
      successor = successor.left
    }

    // shift right child of successor
    if(parent == node) {
      parent.right = successor.right
    } else {
      parent.left = successor.right
    }

    // copy successor data to "deleted" node
    node.data = successor.data
    successor = null
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

const bst = new Tree([1, 7, 4, 23, 8, 9, 4, 3, 5, 7, 67, 6345, 324])
bst.delete(23)
bst.parseTree()