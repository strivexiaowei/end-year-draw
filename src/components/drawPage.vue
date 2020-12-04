<template>
    <div class="draw-page">
        <div @click="closeDraw" class="close-box">
            <i class="el-icon-circle-close"></i>
        </div>
        <div id="myCanvasContainer">
            <canvas width="800" height="800" id="myCanvas">
                <p>Anything in here will be replaced on browsers that support the canvas element</p>
            </canvas>
        </div>
        <div id="tags">
            <ul>
                <li v-for="(item, index) in tags" :key="index">
                    <a href="#" target="_blank">
                        <img style="width: 50px; heigth: auto;" :src="item.picture" alt="">
                    </a>
                </li>
            </ul>
        </div>
        <button @click="startDraw">开始</button>
        <button @click="stopDraw">停止</button>
    </div>
</template>

<script>
/* eslint-disable */
import { queryStaffs } from '@/service/pageAjax'
export default {
    name: 'drawPage',
    props: {
        msg: String
    },
    data () {
        return {
            myOption: {
                textColour: null,
                dragControl: 1,
                textHeight: 20,
                noSelect: true,
                lock: 'xy'
            },
            tags: []
        }
    },
    created () {
        this.getStaffList()
    },
    methods: {
        async getStaffList (params = {}) {
            const res = await queryStaffs(params)
            console.log(res)
            this.tags = [...res]
        },
        speed() {
            return [0.1 * Math.random() + 0.01, -(0.1 * Math.random() + 0.01)];
        },
        drawCanvas () {
            const { myOption, speed } = this
            window.TagCanvas.Start('myCanvas', 'tags', { ...myOption, initial: speed() })
        },
        startDraw () {
            const { speed } = this
            window.TagCanvas.SetSpeed('myCanvas', [5, 1]);
        },
        stopDraw () {
            const { speed } = this
            window.TagCanvas.SetSpeed('myCanvas', speed())
        },
        closeDraw () {
            this.$emit('closeDraw', false );
        }
    },
    mounted () {
        console.log(this.tags)
        setTimeout(() => {
            this.drawCanvas()  
        }, 1000)
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.draw-page {
    position: fixed;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    background-color: #333;
    z-index: 2000;
}
.close-box {
    position: absolute;
    top: 10px;
    right: 10px;
    width: 40px;
    height: 40px;
    cursor: pointer;
    i {
        font-size: 34px;
        color: #f4f4f4;
    }
}
</style>
