import { Injectable } from '@nestjs/common';
import { FileReaderService } from 'src/utils/fileReader.service';

// https://adventofcode.com/2020/day/10

/*
** NARRATOR ENTERS THE ROOM **
This is a fun puzzle. In a very short summary: we must create a chain of adapters contemplating the following rules:
1) All adapters must be used
2) One adapter can only be connected to an adapter whose rating is  1,2 or 3 lower than itself.

My initial instinct is to implement a tree in which each node has 3 possible children (1-2-3) lower. 
- A adapter can be a child of multiple parents
- The path that uses all the adapters (the longest?) in the one that should be used to get the result

Let's implement this and hope part 2 doesn't mess with this logic 😉
** NARRATOR LEAVES THE ROOM **
*/

class Node {
  constructor(public readonly value:number) {}

  public child1: Node | null;
  public child2: Node | null;
  public child3: Node | null;
}

class Tree {
  private root: Node;  
  constructor(values: number[]){
    this.constructTree(new Map<number, Node>(values.map(value => [value, new Node(value)]))); 
  }

  private constructTree(nodes: Map<number, Node>,) {
    // Set the node corresponding to the outlet as the root
    this.root = new Node(0);
    nodes.set(0, this.root);

    let highestNode = this.root;

    nodes.forEach(node => {
      if(highestNode.value < node.value){
        highestNode = node;
      }

      node.child1 = nodes.has(node.value + 1)? nodes.get(node.value + 1) : null;
      node.child2 = nodes.has(node.value + 2)? nodes.get(node.value + 2) : null;
      node.child3 = nodes.has(node.value + 3)? nodes.get(node.value + 3) : null;
    });

    // Add the node corresponding to the device connected
    highestNode.child3 = new Node(highestNode.value + 3);
  }

  private _findTheDeepestPath(currentNode: Node, path: Node[], deepestPaths: Map<Node, Node[]>): Node[] {
    if(!currentNode) {
       return path;
    }

    if(deepestPaths.has(currentNode)) {
      return deepestPaths.get(currentNode);
    }

    const pathChild1 =  this._findTheDeepestPath(currentNode.child1, path, deepestPaths);
    const pathChild2 =  this._findTheDeepestPath(currentNode.child2, path, deepestPaths);
    const pathChild3 =  this._findTheDeepestPath(currentNode.child3, path, deepestPaths);

    let deepestPath = pathChild1.length > pathChild2.length? pathChild1 : pathChild2;
    deepestPath = deepestPath.length > pathChild3.length? deepestPath : pathChild3;

    deepestPaths.set(currentNode, [currentNode,...deepestPath]);
    return deepestPaths.get(currentNode);
  }

  private _findNumberOfArrangements(currentNode: Node, calculatedArrangements: Map<Node, number>) : number {
    if(!currentNode) {
      return 0;
    }

    if(calculatedArrangements.has(currentNode)){
      return calculatedArrangements.get(currentNode);
    }
    
    let arrangements = 0;
    arrangements += this._findNumberOfArrangements(currentNode.child1, calculatedArrangements);
    arrangements += this._findNumberOfArrangements(currentNode.child2, calculatedArrangements); 
    arrangements += this._findNumberOfArrangements(currentNode.child3, calculatedArrangements);
    
    arrangements = arrangements === 0 ? 1 : arrangements;
    calculatedArrangements.set(currentNode, arrangements);                       
    return arrangements;
  }

  // The first interaction was two slow, so we store the pre-calculated values for the deepest path of each node
  findTheDeepestPath(): Node[] {
    return this._findTheDeepestPath(this.root, [], new Map());
  }

  findNumberOfArrangements(): number {
    //this._findArrangements2(0, new Set(input), new Map());
    return this._findNumberOfArrangements(this.root, new Map());
  }

}

@Injectable()
export class Day10Service {
  constructor(private readonly fileReaderService: FileReaderService) {}

  processInput(): string {
    const fileContent = this.fileReaderService.readFileAsString('./input/day10.txt').split("\n");
    const tree = new Tree(fileContent.map(line => Number.parseInt(line)));
    return `Part 01 [${this.get1DifferenceMultipliedBy3Difference(tree.findTheDeepestPath())}] Part 02 [${tree.findNumberOfArrangements()}]`;
  }

  get1DifferenceMultipliedBy3Difference(nodes: Node[]) {
    let numberOf1Difference = 0; 
    let numberOf3Difference = 0; 

    for(let i = 0; i < nodes.length - 1; i++){
      if(nodes[i].child1 == nodes[i+1]){
        numberOf1Difference++;
      }

      if(nodes[i].child3 == nodes[i+1]){
        numberOf3Difference++;
      }
    }

    return numberOf1Difference * numberOf3Difference; 
  }

}
