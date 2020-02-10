import global from "../global";

cc.Class({
    extends: cc.Component,

    properties: {
        playerNodePrefab: cc.Prefab,
        healthGameTipLabel: cc.Node,
        createRoomPrefab: cc.Prefab,
        joinRoomPrfab: cc.Prefab
    },
    onLoad() {
        let playerNode = cc.instantiate(this.playerNodePrefab);
        playerNode.parent = this.node;
        // playerNode.x = 
        playerNode.x = cc.view.getVisibleSize().width * -0.5 + playerNode.width * 0.5 + 20;
        playerNode.y = cc.view.getVisibleSize().height * 0.5 - playerNode.height * 0.5 - 20;
        this._playerNode = playerNode;

        global.messageController.connectServer().then(()=>{
            console.log("链接服务器成功");
            return global.messageController.login(global.playerData.getID());
            
        }).then((result)=>{
            console.log("登录成功", result);
           
            let roomId = result.roomId;
            if (roomId && roomId.length === 6){
                global.messageController.sendJoinRoomMessage(roomId).then(()=>{
                    global.controller.enterGameLayer();
                });
            }else{
                this._playerNode.emit("login-success", result);
            }



        }).catch((err)=>{
            console.log("登录失败", err);
        });


       
        this.healthGameTipLabel.runAction(
            cc.repeatForever(
                cc.sequence(
                    cc.moveTo(15, -1200, 0),
                    cc.callFunc(() => {
                        this.healthGameTipLabel.x = 1200;
                    })
                )
            )
        )

    },
    onButtonClick(event, customData) {
        console.log("custom ", customData);
        switch (customData) {
            case 'create_button':
                console.log("玩家点击了创建房间按钮");
                let node = cc.instantiate(this.createRoomPrefab);
                node.parent = this.node;
                break;
            case 'join_room':
                let joinRoom = cc.instantiate(this.joinRoomPrfab);
                joinRoom.parent = this.node;
                break;    
            default:
                break;
        }
    },

    start() {

    },

    update(dt) { }
});
