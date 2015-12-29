'use strict';

var React = require('react-native');
var {
  AppRegistry,
  NavigatorIOS,
  TouchableHighlight,
  StyleSheet,
  Text,
  View,
	ActivityIndicatorIOS,
	TextInput,
	Image,
	SliderIOS,
} = React;

var searchKeywords = [
	"Hello"
	,"See you again"
	,"A new day has come"
];

var TouchableBounce = require('TouchableBounce');

var musicplayer = React.createClass({

	getInitialState:function() {
		this.AudioPlayer = require("./Audio.ios").AudioPlayer;
		return {
			currentState:"loading"
			,keyword:""
			,imageUrl:""
			,playOrPause:"Pause"
			,volume:0.5
		}	
	}	
 
  ,render:function() {
			if(this.state.currentState == "loading") {
				return(	
				<View style={styles.container}>
					<ActivityIndicatorIOS color="red" size="large" animating={true}>
					</ActivityIndicatorIOS>
					<Text style={styles.littleMargin}>loading...</Text>
				</View>
				);
			} else if(this.state.currentState == "searching"){
				return(	
				<View style={styles.container}>
					<ActivityIndicatorIOS color="red" size="large" animating={true}>
					</ActivityIndicatorIOS>
					<Text style={styles.littleMargin}>searching...</Text>
					<Text style={styles.littleMargin}>{this.state.keyword}</Text>
				</View>
				);
			} else if(this.state.currentState == "loadingSound") {
				return(	
				<View style={styles.container}>
					<ActivityIndicatorIOS color="red" size="large" animating={true}>
					</ActivityIndicatorIOS>
					<Text style={styles.littleMargin}>Loading sound ...</Text>
					<Text style={styles.littleMargin}>{this.state.keyword}</Text>
				</View>
				);
			} else if(this.state.currentState == "playing") {
				return(	
				<View style={styles.container}>
					<View style={styles.imageContainer}>
					<Image source={{uri:this.state.imageUrl}} style={{width:300,height:300}}></Image>
					</View>
					<Text style={styles.littleMargin}>{this.state.keyword}  </Text>

					<TouchableBounce style={[styles.reloadSong,styles.littleMargin]} onPress={this._reloadSong}>
        		<Text style={styles.title}>Change Another Song</Text>
					</TouchableBounce>

					<TouchableBounce style={[styles.reloadSong,styles.littleMargin]} onPress={this._playOrPause}>
        		<Text style={styles.title}>{this.state.playOrPause}</Text>
					</TouchableBounce>

   			 <View>
   			     <Text style={styles.littleMargin} >
   			       Volume:{this.state.volume}
   			     </Text>
   			     <SliderIOS
						 	 value = {0.5}
   			       onValueChange={this._configVolume} />
   			   </View>

				</View>
				);
			}
  }

	,componentDidMount:function(){
		this._reloadSong();	
		this.AudioPlayer.setFinishedSubscription((data)=>{ console.log("finished .... ");this._reloadSong();});
	}

	,_reloadSong:function(){
		this.AudioPlayer.stop();
		var _self = this;
		var i = parseInt(Math.random() * searchKeywords.length );
		var keyword = searchKeywords[i];
		this.setState({
			currentState:"searching"
			,keyword:keyword
		});
		searchMusic(keyword,(data)=> {
			if(data.length == 0 ) {
				console.log("not found : " + keyword);
			} else {
				var musicUrl = data[0].audio;
				this.AudioPlayer.playWithUrlCallBack(musicUrl,()=>{
					this.setState({
						currentState:"playing"
						,imageUrl:data[0].album.picUrl
					});
				},()=>{
					this.setState({
						currentState:"loadingSound"	
					});	
				});
			};
		});

	}

	,_playOrPause(){
		if(this.state.playOrPause == "Play"){
			this.AudioPlayer.unpause();	
			this.setState({
				playOrPause:"Pause"	
			});
		} else {
			this.AudioPlayer.pause();	
			this.setState({
				playOrPause:"Play"	
			});
		}
	}

	,_configVolume(value){
		this.setState({
			volume:value	
		});	
		this.AudioPlayer.setVolume(value);
	}

	,componentWillUnmount:function(){
		this.AudioPlayer.stop();	
	}
 
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 30,
    alignItems: 'stretch',
  },
	reloadSong: {
		backgroundColor:"#887761",
		padding: 20,
		borderRadius: 5,
	},
	littleMargin:{
		margin:10
	},
});

function searchMusic(info,dataHandler){
	var url = "http://s.music.163.com/search/get/?type=1&limit=1&jsonpCallback=callback&s=" + info;
	fetch(url)
	.then((response) => response.json())
	.then((responseData) => {
		dataHandler && dataHandler(responseData.result.songs);
	});
}

AppRegistry.registerComponent('rn_simple_music_player', () => musicplayer);
