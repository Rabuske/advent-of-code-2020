import { Injectable } from '@nestjs/common';
import { FileReaderService } from 'src/utils/fileReader.service';

// https://adventofcode.com/2020/day/22

interface Player {
  id: number,
  deck: number[]
}

abstract class Game {
  constructor(public readonly player1: Player, public readonly player2: Player) {}
  protected winner: Player = null;
  abstract playRound();

  get hasGameEnded() : boolean {
    return this.winner !== null;
  }  

  playUntilEnd(){
    while(!this.hasGameEnded){
      this.playRound();
    }
  }

  getWinningPlayerAndScore() : {player: Player, score: number} {
    const score = this.winner.deck.map((value, index) => ({value: value, factor: this.winner.deck.length - index}))
                                    .reduce((result, card) => result + (card.factor * card.value), 0);

    return {player: this.winner, score: score};
  }

  playUsingCardComparison(card1: number, card2: number) {
    if(card1 > card2) {
      this.player1.deck.push(card1);
      this.player1.deck.push(card2);
    } else {
      this.player2.deck.push(card2);
      this.player2.deck.push(card1);
    }
  }

  checkAndUpdateWinner() {
    if(this.player1.deck.length === 0) {
      this.winner = this.player2;
    }

    if(this.player2.deck.length === 0) {
      this.winner = this.player1;
    }
  }
}

class RecursiveGame extends Game{
  private rounds = new Set<string>();
  
  playRound() {
    if(this.rounds.has(this.stateToString())) {
      this.winner = this.player1;
      return;
    }
    
    this.storeRound();

    const card1 = this.player1.deck.shift();
    const card2 = this.player2.deck.shift();

    // Recursion Baby!
    if(this.player1.deck.length >= card1 && this.player2.deck.length >= card2) {
      const subGame = new RecursiveGame(
        {id: 1, deck: [...this.player1.deck.slice(0, card1)]}, 
        {id: 2, deck: [...this.player2.deck.slice(0, card2)]}
      );
      subGame.playUntilEnd();
      if(subGame.winner.id === this.player1.id){
        this.player1.deck.push(card1);
        this.player1.deck.push(card2);  
      } else {
        this.player2.deck.push(card2);
        this.player2.deck.push(card1);  
      }
    } else {
      this.playUsingCardComparison(card1, card2);
    } 
    
    this.checkAndUpdateWinner();
  }

  stateToString(): string{
    return this.player1.deck.join(",") + "|" + this.player2.deck.join(",");
  }

  storeRound(){
    this.rounds.add(this.stateToString());
  }
}

class CompactGame extends Game {

  playRound() {
    const card1 = this.player1.deck.shift();
    const card2 = this.player2.deck.shift();

    this.playUsingCardComparison(card1, card2);
    this.checkAndUpdateWinner();
  }
}

@Injectable()
export class Day22Service implements Processor{
  constructor(private readonly fileReaderService: FileReaderService) {}

  processInput(): string {
    const fileContent = this.fileReaderService
      .readFileAsString('./input/day22.txt')
      .split('\n');
    
    const compactGame = new CompactGame(...this.createPlayers(fileContent));
    const recursiveGame = new RecursiveGame(...this.createPlayers(fileContent));
    compactGame.playUntilEnd();
    recursiveGame.playUntilEnd();
    
    return `Part 01 [${compactGame.getWinningPlayerAndScore().score}] Part 02 [${recursiveGame.getWinningPlayerAndScore().score}]`;
  }  

  createPlayers(input: string[]) : [Player, Player] {
    const player1 = {id: 1, deck: []};
    const player2 = {id: 2, deck: []};

    let currentPlayer = player1;
    input.filter(line => line.length > 0).forEach(line => {
      if(line.startsWith("Player 1")){
        currentPlayer = player1;
        return;
      }
      if(line.startsWith("Player 2")){
        currentPlayer = player2;
        return;
      }

      currentPlayer.deck.push(Number.parseInt(line));
    });    

    return [player1, player2];
  }

}
