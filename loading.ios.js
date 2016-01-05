'use strict';

var React = require('react-native');
var {
  AppRegistry,
  NavigatorIOS,
	ActivityIndicatorIOS,
	Text,
	StyleSheet,
	View,
	NativeModules,
} = React;

var rctUpdateObj = NativeModules.RctUpdate;
var TouchableBounce = require("TouchableBounce");

var LoadButton = React.createClass({
		getInitialState:function(){
				this.url = this.props.url;
				return {};
		}
		,render:function(){
			return (
				<TouchableBounce style={styles.loadButton} onPress={this._loadUrl}>
				<Text style={styles.buttonText}>{this.url}</Text>
				</TouchableBounce>
			);	
		}
		,_loadUrl:function(){
			if(this.url != "appin") {
				this.url = "http://" + this.url + ":8081/index.ios.bundle";
			}
			rctUpdateObj.loadFromUrl(this.url);
		}
});

var musicplayer = React.createClass({

	getInitialState:function() {
		return {
			currentState:"loading"
		}	
	}	
 
  ,render:function() {
		return(	
		<View style={styles.container}>
			<LoadButton url="localhost"></LoadButton>
			<LoadButton url="10.217.39.208"></LoadButton>
			<LoadButton url="192.168.1.102"></LoadButton>
			<LoadButton url="appin"></LoadButton>
		</View>
		);
  }

	,componentDidMount:function(){
		rctUpdateObj.simpleTest();
		return ;
	}

});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 30,
    alignItems: 'stretch',
		justifyContent:'center',
		backgroundColor:'#eee'
  },
	loadButton: {
		//backgroundColor:"#887761",
		padding: 20,
		borderRadius: 8,
		borderWidth:2,
		borderColor:"blue",
		marginTop:20,
		alignItems:'center',
		justifyContent:'center',
	},
	buttonText: {
		fontSize:25,
		color:"red"	
	}
});

AppRegistry.registerComponent('rn_simple_music_player', () => musicplayer);
