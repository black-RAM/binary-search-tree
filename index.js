class Node{
  constructor(data, parent) {
    this.data = data
    this.left = null
    this.right = null
    this.parent = parent
  }

  assignSubtree(value) { // left < root < right
    return this.data < value ? "right" : "left"
  }
}

class Tree{
  constructor(array) {
    this.root = this.buildTree(array.sort((a, b) => a - b), 0, array.length - 1) 
  }

  buildTree(arr, start, end, parent = null) {
    if(start > end) return null

    const mid = Math.floor((start + end) / 2)
    const root = new Node(arr[mid], parent)
    root.left = this.buildTree(arr, start, mid - 1, root)
    root.right = this.buildTree(arr, mid + 1, end, root)
    return root
  }

  insert(value, node = this.root, parent = null) {
    if(node == null) return new Node(value)
    const sub = node.assignSubtree(value)
    node[sub] = this.insert(value, node[sub], node)
    return node
  }

  find(value, node = this.root) {
    if(node == null || node.data == value) return node
    return this.find(value, node[node.assignSubtree(value)])
  }

  delete(value) {
    let node = this.find(value)

    // node has one child or no children
    if(!(!!node.left && !!node.right)) {
      const heir = node[node.left == null ? "right" : "left"]

      if(node.parent) {
        if(node.parent.left == node) {
          node.parent.left = heir
        } else {
          node.parent.right = heir
        }
      } else {
        this.root = heir
      }

      if(heir) {
        heir.parent = node.parent
      }
    } else{
      // node has two children
      let successor = node.right

      // leftmost node of right subtree is successor
      while(successor.left !== null) {
        successor = successor.left
      }

      // shift right child of successor
      if(successor.parent == node) {
        successor.parent.right = successor.right
      } else {
        successor.parent.left = successor.right
      }

      // copy successor data to "deleted" node
      node.data = successor.data
      successor = null
    }
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