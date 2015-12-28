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
} = React;

var searchKeywords = [
	"hello"
	,"我的未来不是梦"
	,"想你的365天"
	,"羽泉 奔跑"
	,"always online"
	,"my heart will go on"
];

var TouchableBounce = require('TouchableBounce');

var musicplayer = React.createClass({

	getInitialState:function() {
		this.AudioPlayer = require("./Audio.ios").AudioPlayer;
		return {
			currentState:"loading"
			,keyword:""
		}	
	}	
 
  ,render:function() {
			if(this.state.currentState == "loading") {
				return(	
				<View style={styles.container}>
					<ActivityIndicatorIOS color="red" size="large" animating={true}>
					</ActivityIndicatorIOS>
					<Text style={styles.littlemargin}>loading...</Text>
				</View>
				);
			} else if(this.state.currentState == "searching"){
				return(	
				<View style={styles.container}>
					<ActivityIndicatorIOS color="red" size="large" animating={true}>
					</ActivityIndicatorIOS>
					<Text style={styles.littlemargin}>searching...</Text>
					<Text style={styles.littlemargin}>{this.state.keyword}</Text>
				</View>
				);
			} else if(this.state.currentState == "loadingSound") {
				return(	
				<View style={styles.container}>
					<ActivityIndicatorIOS color="red" size="large" animating={true}>
					</ActivityIndicatorIOS>
					<Text style={styles.littlemargin}>Loading sound ...</Text>
					<Text style={styles.littlemargin}>{this.state.keyword}</Text>
				</View>
				);
			} else if(this.state.currentState == "playing") {
				return(	
				<View style={styles.container}>
					<Text style={styles.littlemargin}>{this.state.keyword} PLAYING ... </Text>
					<TouchableBounce style={[styles.reloadSong,styles.littleMargin]} onPress={this._reloadSong}>
        		<Text style={styles.title}>Change Another Song</Text>
					</TouchableBounce>
				</View>
				);
			}
  }

	,componentDidMount:function(){
		this._reloadSong();	
		this.AudioPlayer.setFinishedSubscription((data)=>{ console.log("finished .... ");this._reloadSong();});
	}

	,_reloadSong:function(){
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
					});
				},()=>{
					this.setState({
						currentState:"loadingSound"	
					});	
				});
			};
		});

	}

	,componentWillUnmount:function(){
		this.AudioPlayer.stop();	
	}
 
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 30,
    marginTop: 65,
    alignItems: 'stretch',
  },
	reloadSong: {
		backgroundColor:"#887761",
		padding: 20,
		borderRadius: 5,
	},
	littleMargin:{
		marginTop:10
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
