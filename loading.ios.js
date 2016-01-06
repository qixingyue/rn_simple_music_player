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
				var epos = this.url.indexOf("/",10);
				this.showText = this.url.substring(7,epos);
				return {};
		}
		,render:function(){
			return (
				<View>
					<TouchableBounce style={styles.loadButton} onPress={this._loadUrl}>
					<Text style={styles.buttonText}>{this.showText}</Text>
					</TouchableBounce>
					<TouchableBounce style={styles.loadButton} onPress={this._loadLocal}>
					<Text style={styles.buttonText}>LOCAL</Text>
					</TouchableBounce>
				</View>
			);	
		}
		,_loadUrl:function(){
			if(this.moduleName == null) {
				this.moduleName = "rn_simple_music_player";
			} 
			rctUpdateObj.loadFromUrl(this.url,this.moduleName);
		}
		,_loadLocal:function(){
			rctUpdateObj.loadFromLocal(this.moduleName);
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
				renderRow = {(rowData) => <LoadButton url={rowData.url} moduleName={rowData.moduleName}></LoadButton>}
			>
			</ListView>
		</View>
		);
  }

	,componentDidMount:function(){

		fetch("http://anyapi.sinaapp.com/rnapp/app.php?password=de7e95132907c131911a952240a246e2")
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
