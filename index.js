class Node{
  constructor(data) {
    this.data = data
    this.left = null
    this.right = null
  }

  assignSubtree(value) { // left < root < right
    return this.data < value ? "right" : "left"
  }
}

class Tree{
  constructor(array) {
    const input = [...new Set(array.sort((a, b) => a - b))]
    this.root = this.buildTree(input, 0, input.length - 1) 
  }

  buildTree(arr, start, end) {
    if(start > end) return null

    const mid = Math.floor((start + end) / 2)
    const root = new Node(arr[mid])
    root.left = this.buildTree(arr, start, mid - 1, root)
    root.right = this.buildTree(arr, mid + 1, end, root)
    return root
  }

  insert(value, node = this.root) {
    if(node == null) return new Node(value)
    const sub = node.assignSubtree(value)
    node[sub] = this.insert(value, node[sub], node)
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
    if(!(node.left && node.right)) {
      const heir = node[!node.left ? "right" : "left"]
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

  find(value, node = this.root) {
    if(node == null || node.data == value) return node
    return this.find(value, node[node.assignSubtree(value)])
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

  balance(tree = this.root) {
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

  // impure method: mutates this.root
  rebalance(){
    this.root = this.balance()
  }
}

// driver script
let input = Array.from({length: 40}, () => parseInt(Math.random() * 100))
const bst = new Tree(input)
console.log("Binary Search Tree (40 Numbers less than 100): ")
bst.parseTree()
console.log("Tree is balanced: ", bst.isBalanced())
console.log("Level order: ", bst.levelOrder())
console.log("Pre-order: ", bst.preOrder())
console.log("Post-order: ", bst.postOrder())
console.log("In-order: ", bst.inOrder())

console.log("Binary Search Tree (with 40 numbers over 100): ")
input = Array.from({length: 40}, () => 100 + parseInt(Math.random() * 100))
for (const n of input) {
  bst.insert(n)
}
bst.parseTree()
console.log("Tree is balanced: ", bst.isBalanced())
console.log("Re-balancing...")
bst.rebalance()
bst.parseTree()
console.log("Tree is balanced: ", bst.isBalanced())
console.log("Level order: ", bst.levelOrder())
console.log("Pre-order: ", bst.preOrder())
console.log("Post-order: ", bst.postOrder())
console.log("In-order: ", bst.inOrder())