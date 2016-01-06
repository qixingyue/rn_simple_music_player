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
	ListView,
} = React;

var rctUpdateObj = NativeModules.RctUpdate;
var TouchableBounce = require("TouchableBounce");

var LoadButton = React.createClass({
		getInitialState:function(){
				this.url = this.props.url;
				this.moduleName = this.props.moduleName;
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
			this.url = "http://" + this.url + ":8081/index.ios.bundle";
			if(this.moduleName == null) {
				this.moduleName = "rn_simple_music_player";
			} 
			rctUpdateObj.loadFromUrl(this.url,this.moduleName);
		}
});

var musicplayer = React.createClass({

	getInitialState:function() {
		var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 != r2});
		return {
			currentState:"loading"
			,dataSource: ds.cloneWithRows([]),
		}	
	}	
 
  ,render:function() {
		return(	
		<View style={styles.container}>
			<ListView 
				dataSource = {this.state.dataSource}	
				renderRow = {(rowData) => <LoadButton url={rowData.host} moduleName={rowData.moduleName}></LoadButton>}
			>
			</ListView>
		</View>
		);
  }

	,componentDidMount:function(){

		fetch("http://anyapi.sinaapp.com/rnhost.json")
		.then((response) => response.json())
		.then((hostJson) => {
			this.setState({
				dataSource:this.state.dataSource.cloneWithRows(hostJson)
			});
		})
		.done();

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
