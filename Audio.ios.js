'use strict';

/**
 * This module is a thin layer over the native module. It's aim is to obscure
 * implementation details for registering callbacks, changing settings, etc.
*/

var React, {NativeModules, NativeAppEventEmitter, DeviceEventEmitter} = require('react-native');

var AudioPlayerManager = NativeModules.AudioPlayerManager;
var AudioRecorderManager = NativeModules.AudioRecorderManager;

var AudioPlayer = {
  play: function(path) {
    AudioPlayerManager.play(path);
  },

	//带有回调的playUrl
  playWithUrlCallBack: function(url,callback,beforeLoading) {
		var mybeforeLoading = NativeAppEventEmitter.addListener("urlLoadBegin",
				(beginObj) => {
					beforeLoading && beforeLoading(beginObj)
		});
		var mycallback = function(){
			mybeforeLoading.remove();
			callback();	
		};
    AudioPlayerManager.playWithUrlCallBack(url,mycallback);
  },
  playWithUrl: function(url) {
    AudioPlayerManager.playWithUrl(url);
  },
  pause: function() {
    AudioPlayerManager.pause();
  },
  unpause: function() {
    AudioPlayerManager.unpause();
  },
  stop: function() {
    AudioPlayerManager.stop();
    if (this.subscription) {
      this.subscription.remove();
    }
  },
  setCurrentTime: function(time) {
    AudioPlayerManager.setCurrentTime(time);
  },
  setProgressSubscription: function() {
    this.progressSubscription = DeviceEventEmitter.addListener('playerProgress',
      (data) => {
        if (this.onProgress) {
          this.onProgress(data);
        }
      }
    );
  },
  setFinishedSubscription: function(fnHandler) {
    this.progressSubscription = DeviceEventEmitter.addListener('playerFinished',
      (data) => {
				console.log("FINISHED");
        if (this.onFinished) {
          this.onFinished(data);
        }

				fnHandler && fnHandler(data);
      }
    );
  },
  getDuration: function(callback) {
    AudioPlayerManager.getDuration((error, duration) => {
      callback(duration);
    })
  },
	setVolume: function(v){
		AudioPlayerManager.setVolume(v);			
	}
};

var AudioRecorder = {
  prepareRecordingAtPath: function(path) {
    AudioRecorderManager.prepareRecordingAtPath(path);
    this.progressSubscription = NativeAppEventEmitter.addListener('recordingProgress',
      (data) => {
        console.log(data);
        if (this.onProgress) {
          this.onProgress(data);
        }
      }
    );

    this.FinishedSubscription = NativeAppEventEmitter.addListener('recordingFinished',
      (data) => {
        if (this.onFinished) {
          this.onFinished(data);
        }
      }
    );
  },
  startRecording: function() {
    AudioRecorderManager.startRecording();
  },
  pauseRecording: function() {
    AudioRecorderManager.pauseRecording();
  },
  stopRecording: function() {
    AudioRecorderManager.stopRecording();
    if (this.subscription) {
      this.subscription.remove();
    }
  },
  playRecording: function() {
    AudioRecorderManager.playRecording();
  },
  stopPlaying: function() {
    AudioRecorderManager.stopPlaying();
  }
};

module.exports = {AudioPlayer, AudioRecorder};
