export class Controller{
    constructor($canvas){
        this.$canvas = $canvas
        this.pressed_keys = new Set()
        this.start()
    }
    start(){
        let outer = this
        this.$canvas.keydown((e)=>{
            outer.pressed_keys.add(e.key)
            // console.log(outer.pressed_keys)
        })
        this.$canvas.keyup((e)=>{
            outer.pressed_keys.delete(e.key)
            // console.log(outer.pressed_keys)
        })
    }

}