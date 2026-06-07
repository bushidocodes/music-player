import React, {Component} from 'react';
import AUDIO from '../audio';
import store from '../store';
import {previous, next, setProgress, toggleSong} from '../action-creators/player';
import Player from '../components/Player';

export default class extends Component {

  constructor() {
    super();
    this.state = store.getState().player;
    this.toggle = this.toggle.bind(this);
    this.next = this.next.bind(this);
    this.prev = this.prev.bind(this);
  }

  componentDidMount() {
    this._onEnded = () => this.next();
    this._onTimeUpdate = () => {
      const duration = AUDIO.duration;
      if (duration && isFinite(duration)) {
        store.dispatch(setProgress(AUDIO.currentTime / duration));
      }
    };

    AUDIO.addEventListener('ended', this._onEnded);
    AUDIO.addEventListener('timeupdate', this._onTimeUpdate);

    this.unsubscribe = store.subscribe(() => {
      this.setState(store.getState().player);
    });
  }

  componentWillUnmount() {
    AUDIO.removeEventListener('ended', this._onEnded);
    AUDIO.removeEventListener('timeupdate', this._onTimeUpdate);
    this.unsubscribe();
  }

  next() {
    store.dispatch(next());
  }

  prev() {
    store.dispatch(previous());
  }

  toggle() {
    store.dispatch(
      toggleSong(this.state.currentSong, this.state.currentSongList)
    );
  }

  render() {
    return <Player
      {...this.state}
      next={this.next}
      prev={this.prev}
      toggle={this.toggle}
    />;
  }

}