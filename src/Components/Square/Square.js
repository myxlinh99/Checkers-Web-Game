import React from 'react';
import WhiteCheckersPiece from '../../images/white-checkers-piece.png';
import BrownCheckersPiece from '../../images/brown-checkers-piece.png';
export default function Square(props) {
    return (
    <button 
      className={props.className}
      onClick={props.onClick}
    >
      <img src={        props.value === 'w' && WhiteCheckersPiece 
                     || props.value === 'b' && BrownCheckersPiece
                     || ''}
              />
    </button>)
    }
