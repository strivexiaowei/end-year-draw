<template>
    <div class="home">
        <vxe-form :data="formData" @submit="findList">
            <vxe-form-item title="奖品名称" field="name">
                <template v-slot>
                    <vxe-input v-model="formData.name" placeholder="请输入名称"></vxe-input>
                </template> 
            </vxe-form-item>
            <vxe-form-item>
                <template v-slot>
                    <vxe-button type="submit" status="primary">查询</vxe-button>
                    <vxe-button type="reset">重置</vxe-button>
                    <vxe-button @click="insertEvent(-1)" type="buttom" status="primary">新增</vxe-button>
                </template>
            </vxe-form-item>
        </vxe-form>

        <vxe-table
            ref="PrizeTable"
            border
            resizable
            keep-source
            :loading="loading"
            :data="tableData"
            @edit-closed="editClosedEvent"
            :edit-config="{trigger: 'click', mode: 'row'}"
        >
            <vxe-table-column type="seq" width="60"></vxe-table-column>
            <vxe-table-column field="name" title="奖品名称" :edit-render="{name: 'input', attrs: {type: 'text'}}"></vxe-table-column>
            <vxe-table-column field="level" title="抽奖等级" :edit-render="{name: 'input', attrs: {type: 'text'}}"></vxe-table-column>
            <vxe-table-column field="valuation" title="单价" :edit-render="{name: 'input', attrs: {type: 'number'}}"></vxe-table-column>
            <vxe-table-column field="count" title="数量" :edit-render="{name: 'input', attrs: {type: 'number'}}"></vxe-table-column>
            <vxe-table-column field="picture" title="图片">
                <template v-slot="{ row }">
                    <div class="cz">
                        <label :for="row._XID">
                            <input :id="row._XID" hidden type="file" @change="filePicture($event, row)" accept="image/*">
                            <i v-if="!row.picture" class="el-icon-circle-plus"></i>
                            <div v-else class="head-box" :style="'background-image: url(' + row.picture + ');'"></div>
                        </label>
                    </div>
                </template>
            </vxe-table-column>
            <vxe-table-column title="操作">
                <template v-slot="{ row }">
                    <div class="cz">
                        <i @click="deletePrizeById(row.id)" class="el-icon-delete"></i>
                    </div>
                </template>
            </vxe-table-column>
        </vxe-table>
    </div>
</template>

<script>
// @ is an alias to /src
import { interval, Subject } from 'rxjs'
import { take } from 'rxjs/operators'
import { queryPrizes, createPrize, uploadPic, deletePrize } from '@/service/pageAjax'
export default {
    name: 'Prize',
    data () {
        return {
            buttonText: '倒计时',
            isDisabled: false,
            seconds: 50,
            name: new Subject(),
            loading: false,
            formData: {
                name: undefined
            },
            tableData: [],
            gender: [
                { value: '男', label: '男' },
                { value: '女', label: '女' }
            ]
        }
    },
    created () {
        this.findList()
    },
    methods: {
        countDown () {
            interval(1000)
                .pipe(take(this.seconds + 1)) // 注意哦，这里是做 +1 的操作
                .subscribe({
                    next: (value) => {
                        this.isDisabled = true
                        console.log(value)
                        this.buttonText = `重新获取(${this.seconds - value}s)`
                    },
                    error: null,
                    complete: () => {
                        this.buttonText = '重新获取'
                        this.isDisabled = false
                    }
                })
        },
        findList () {
            this.loading = true
            const { formData } = this
            const params = {
                params: {
                    filter: {
                        where: { ...formData }
                    }
                }
            }
            this.queryPrizesList(params)
        },
        async queryPrizesList (params = {}) {
            console.log(params)
            const res = await queryPrizes(params)
            console.log(res)
            if (res) {
                this.tableData = res
                this.loading = false
            }
        },
        async filePicture (file, row) {
            console.log(row)
            console.log(file)
            const fileData = file.target.files[0]
            const formData = new FormData()
            formData.append('file', fileData)
            console.log(row)
            const res = await uploadPic(formData)
            const { code } = res
            if (code === 200) {
                row.picture = res.data[0].result
            }
            delete row._XID
            const res1 = await createPrize(row)
            if (res1) {
                const xTable = this.$refs.PrizeTable
                xTable.reloadRow(row, null, 'picture')
            }
        },
        async insertEvent (row) {
            const record = {
                gender: '男'
            }
            const xTable = this.$refs.PrizeTable
            xTable.insertAt(record, row).then(({ row }) => {
                xTable.setActiveRow(row)
            })
        },
        async editClosedEvent ({ row, column }) {
            console.log(row, column)
            const xTable = this.$refs.PrizeTable
            const field = column.property
            if (xTable.isUpdateByRow(row, field) || xTable.isInsertByRow(row)) {
                console.log('改变了')
                delete row._XID
                const res = await createPrize(row)
                // 局部更新单元格为已保存状态
                if (res) {
                    this.$XModal.message({
                        message: '保存成功',
                        status: 'success'
                    })
                    xTable.reloadRow(row, null, field)
                }
            }
        },
        async deletePrizeById (id) {
            const res = await deletePrize(id)
            if (res) {
                this.queryPrizesList()
            }
        }
    }
}
</script>

<style scoped lang="scss">
    .cz {
        display: flex;
        justify-content: center;
        i {
            padding: 0 8px;
            cursor: pointer;
            font-size: 18px;
        }
    }
    .head-box {
        width: 50px;
        height: 50px;
        margin: 0 auto;
        background-size: contain;
    }
</style>
