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

  delete(value, node = this.root) {
    node = this.find(value, node)
    if(node == null) return

    // node has one child or no children
    if(!(!!node.left && !!node.right)) {
      const heir = node[!node.left ? "right" : "left"]

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

  levelOrder(mutator = (el => el), node = this.root) {
    const queue = []
    const data = []
    queue.push(node)
    while(queue.length > 0) {
      const current = queue.shift()
      current.data = mutator(current.data)
      data.push(current.data)
      if(current.left) queue.push(current.left)
      if(current.right) queue.push(current.right)
    }
    return data
  }

  preOrder(mutator = (el => el), node = this.root, data = []) {
    if(node == null) return

    node.data = mutator(node.data)
    data.push(node.data)

    this.preOrder(mutator, node.left, data)
    this.preOrder(mutator, node.right, data)

    return data
  }

  inOrder(mutator = (el => el), node = this.root, data = []) {
    if(node == null) return

    this.inOrder(mutator, node.left, data)

    node.data = mutator(node.data)
    data.push(node.data)
      
    this.inOrder(mutator, node.right, data)

    return data
  }

  postOrder(mutator = (el => el), node = this.root, data = []) {
    if(node == null) return

    this.postOrder(mutator, node.left, data)
    this.postOrder(mutator, node.right, data)

    node.data = mutator(node.data)
    data.push(node.data)

    return data
  }

  height(node = this.root) {
    if(node == null) return -1
    return 1 + Math.max(this.height(node.left), this.height(node.right))
  }

  depth(target = this.root, node = this.root, edges = 0) {
    if(node == target) return edges
    return this.depth(target, node[node.assignSubtree(target.data)], edges + 1)
  }

  isBalanced(tree = this.root) {
    if(tree == null) return true
    const diff = Math.abs(this.height(tree.left) - this.height(tree.right))
    return diff <= 1 && this.isBalanced(tree.left) && this.isBalanced(tree.right)
  }

  balance(tree = this.root) { // also removes duplicates
    if(this.isBalanced(tree)) return tree
    const data = [...new Set(this.inOrder(el => el, tree))]
    tree = this.buildTree(data, 0, data.length - 1)
    return tree
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

  // impure methods: mutate this.root
  rebalance(){
    this.root = this.balance()
  }

  insertBalanced(value) {
    this.insert(value)
    this.rebalance()
  }
}

const inputs = [1, 7, 4, 23, 8, 9, 4, 3, 5, 7, 67, 6345, 324]
const bst = new Tree([1])
for (const input of inputs) {
  bst.insert(input)
}
bst.parseTree()
console.log("Tree balanced? ", bst.isBalanced())
bst.rebalance()
bst.parseTree()
console.log("Tree balanced? ", bst.isBalanced())
