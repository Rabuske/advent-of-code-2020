import { Injectable } from '@nestjs/common';
import { FileReaderService } from 'src/utils/fileReader.service';

// https://adventofcode.com/2020/day/23

// I could use an array an index manipulation to achieve the same results. However, I woke up in the mood to implement the circular queue using pointers :)
class Node <valueType> { 

  constructor(private readonly _value : valueType, private _next? : Node<valueType>, private _previous?: Node<valueType>) {};

  get value() : valueType {
    return this._value;
  }

  get next() : Node<valueType> {
    return this._next;
  }

  set next(nextNode: Node<valueType>) {
    this._next = nextNode;
  }

  get previous() : Node<valueType> {
    return this._previous;
  }

  set previous(previousNode: Node<valueType>) {
    this._previous = previousNode;
  }
}

class CircularQueue<valueType> {
  private _currentNode: Node<valueType>;
  private _nodeMap = new Map<valueType, Node<valueType>>();

  public static createFromNodes(nodes: Node<any>[]) : CircularQueue<any> {
    const queue = new CircularQueue();
    queue._currentNode = nodes[0];
    nodes.forEach(node => queue._nodeMap.set(node.value, node));
    return queue;
  }

  public static createFromValues(values: any[]) : CircularQueue<any> {
    const queue = new CircularQueue();
    const nodesFromValues = values.map(value => new Node(value));
    queue._currentNode = nodesFromValues[0];
    for (let index = 0; index < nodesFromValues.length; index++) {
      nodesFromValues[index].next = nodesFromValues[index + 1 === nodesFromValues.length? 0 : index + 1];      
      nodesFromValues[index].previous = nodesFromValues[index === 0? nodesFromValues.length-1 : index - 1];
      queue._nodeMap.set(nodesFromValues[index].value, nodesFromValues[index]);      
    }  
    return queue;
  }

  public getFromValue(value: valueType){
    return this._nodeMap.get(value);
  }

  public removeSlice(numberOfNodes: number, startingNode: Node<valueType>): CircularQueue<valueType> {
    const nodesOfSlice = new Array<Node<valueType>>();
    let currentNode = startingNode;
    for (let index = 0; index < numberOfNodes; index++) {
      nodesOfSlice.push(currentNode);
      currentNode = currentNode.next;
    }

    const nodeBeforeSlice = nodesOfSlice[0].previous;
    const nodeAfterSlice = nodesOfSlice[nodesOfSlice.length-1].next;
    nodeBeforeSlice.next = nodeAfterSlice;
    nodeAfterSlice.previous = nodeBeforeSlice;

    nodesOfSlice[0].previous = nodesOfSlice[nodesOfSlice.length-1];
    nodesOfSlice[nodesOfSlice.length-1].next = nodesOfSlice[0];

    nodesOfSlice.forEach(node => this._nodeMap.delete(node.value));

    // TODO: update current node pointer in case it is part of the slice;

    return CircularQueue.createFromNodes(nodesOfSlice);
  }

  public addSlice(otherQueue: CircularQueue<valueType>, startingNode: Node<valueType>) {
    const nodeAfterStarting = startingNode.next;
    const nodesToInsert = otherQueue.getNodesAsList();
    startingNode.next = nodesToInsert[0];
    nodesToInsert[0].previous = startingNode;
    
    nodeAfterStarting.previous = nodesToInsert[nodesToInsert.length-1];
    nodesToInsert[nodesToInsert.length-1].next = nodeAfterStarting;

    nodesToInsert.forEach(node => this._nodeMap.set(node.value, node));
  }

  public advanceCursor(positions = 1){
    for (let index = 0; index < positions; index++) {
      this._currentNode = this._currentNode.next;
    }
  }

  public retreatCursor(positions = 1) {
    for (let index = 0; index < positions; index++) {
      this._currentNode = this._currentNode.previous;
    }
  }

  public getNodesAsList(startingNode? : Node<valueType>): Node<valueType>[]{
    const result = new Array<Node<valueType>>();
    let currentNode = startingNode? startingNode : this._currentNode;
    for (let index = 0; index < this._nodeMap.size; index++) {
      result.push(currentNode);
      currentNode = currentNode.next;     
    }
    return result;
  }

  get currentNode() : Node<valueType>{
    return this._currentNode;
  } 

}

class CrabGame {
  private cups: CircularQueue<number>;
  private highestCupValue: number;

  constructor(cupValues: number[]) {
    this.cups = CircularQueue.createFromValues(cupValues);
    this.highestCupValue = cupValues.reduce((a,b) => a > b? a : b);
  }

  public playRound(){
    const removedCups = this.cups.removeSlice(3, this.cups.currentNode.next);
    const destinationCup = this.getDestinationCup();
    this.cups.addSlice(removedCups, destinationCup);
    this.cups.advanceCursor();
  }

  public playMultipleRounds(numberOfRounds : number) {
    for (let index = 0; index < numberOfRounds; index++) {
      this.playRound();
    }
  }

  public getResult() : string {
    const initialNode = this.cups.getFromValue(1);
    return this.cups.getNodesAsList(initialNode).map(node => node.value).reduce((a,b) => a + b, "");
  }

  private getDestinationCup() : Node<number> {
    let destinationCup: Node<number>; 
    let destinationCupValue = this.cups.currentNode.value - 1;
    while(!destinationCup) {
      destinationCup = this.cups.getFromValue(destinationCupValue);
      destinationCupValue--;
      destinationCupValue =  destinationCupValue < 0? this.highestCupValue : destinationCupValue;
    }
    return destinationCup;
  }

  public getMultiplicationValueOfTwoCupsAdjacentTo(value: number) : number {
    const cup = this.cups.getFromValue(value);
    return cup.next.value * cup.next.next.value;
  }

}

@Injectable()
export class Day23Service implements Processor{
  constructor(private readonly fileReaderService: FileReaderService) {}

  processInput(): string {
    const fileContent = this.fileReaderService
      .readFileAsString('./input/day23.txt')
      .split('\n');

    const [simpleGame, complexGame] = this.createGames(fileContent[0]);
    simpleGame.playMultipleRounds(100);
    complexGame.playMultipleRounds(10000000);
        
    return `Part 01 [${simpleGame.getResult()}] Part 02 [${complexGame.getMultiplicationValueOfTwoCupsAdjacentTo(1)}]`;
  } 
  
  createGames(input: string): [CrabGame, CrabGame] {
    const values = input.split("").map(value => Number.parseInt(value));
    let highestValue = values.reduce((a,b) => a > b? a : b);
    const complexValues = new Array<number>();
    for (let index = 0; index < 1000000; index++) {
      if(index < values.length){
        complexValues.push(values[index]);
        continue;
      } 
      highestValue++;
      complexValues.push(highestValue);
    }

    return [new CrabGame(values), new CrabGame(complexValues)]
  }
}
