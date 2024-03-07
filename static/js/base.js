import {GameMap} from './game_map/base.js'
import {Kyo} from './players/kyo.js'

class KOF{
    constructor(id){
        this.$kof = $('#'+id)
        console.log(this.$kof)
        this.game_map = new GameMap(this)
        console.log(this.game_map)

        this.players = [
            new Kyo(this,{
                id: 0,
                x:200,
                y:0,
                width: 120,
                height: 200,
                color:'blue',
            }),
            new Kyo(this,{
                id: 1,
                x:800,
                y:0,
                width: 120,
                height: 200,
                color:'red',
            }),
        ]
    }
}


export{
    KOF
}