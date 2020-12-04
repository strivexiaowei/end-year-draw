<template>
    <div class="home">
        <vxe-form :data="formData" @submit="findList">
            <vxe-form-item title="奖项名称" field="name">
                <template v-slot>
                    <vxe-input v-model="formData.name" placeholder="请输入名称"></vxe-input>
                </template> 
            </vxe-form-item>
            <vxe-form-item title="奖品名称" field="prizeId">
                <template v-slot>
                    <vxe-select v-model="formData.prizeId" placeholder="请选择奖品名称">
                        <vxe-option v-for="(item, index) in prizeOptions" :key="index" :value="item.value" :label="item.label"></vxe-option>
                    </vxe-select>
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
            ref="AwardTable"
            border
            resizable
            keep-source
            :loading="loading"
            :data="tableData"
            @edit-closed="editClosedEvent"
            :edit-config="{trigger: 'click', mode: 'row'}"
        >
            <vxe-table-column type="seq" width="60"></vxe-table-column>
            <vxe-table-column field="name" title="奖项名称" :edit-render="{name: 'input', attrs: {type: 'text'}}"></vxe-table-column>
            <vxe-table-column field="level" title="等级" :edit-render="{name: 'input', attrs: {type: 'number'}}"></vxe-table-column>
            <vxe-table-column field="count" title="奖池数量" :edit-render="{name: 'input', attrs: {type: 'text'}}"></vxe-table-column>
            <vxe-table-column field="prizeId" title="奖品名称" :edit-render="{name: '$select', options: prizeOptions}"></vxe-table-column>
            <vxe-table-column title="操作">
                <template v-slot="{ row }">
                    <div class="cz">
                        <i @click="deleteAwardById(row.id)" class="el-icon-delete"></i>
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
import { queryPrizes, queryAwards, createAward, deleteAward } from '@/service/pageAjax'
export default {
    name: 'Awards',
    data () {
        return {
            buttonText: '倒计时',
            isDisabled: false,
            seconds: 50,
            name: new Subject(),
            loading: false,
            formData: {
                name: undefined,
                prizeId: undefined
            },
            tableData: [],
            prizeOptions: []
        }
    },
    created () {
        this.getPrizes()
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
        async getPrizes () {
            const res = await queryPrizes()
            this.prizeOptions = [...res.map(({ id, name }) => ({
                label: name,
                value: id
            }))]
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
            this.queryAwardsList(params)
        },
        async queryAwardsList (params = {}) {
            console.log(params)
            const res = await queryAwards(params)
            console.log(res)
            if (res) {
                this.tableData = res
                this.loading = false
            }
        },
        async insertEvent (row) {
            const xTable = this.$refs.AwardTable
            xTable.insertAt({}, row).then(({ row }) => {
                xTable.setActiveRow(row)
            })
        },
        async editClosedEvent ({ row, column }) {
            console.log(row, column)
            const xTable = this.$refs.AwardTable
            const field = column.property
            if (xTable.isInsertByRow(row) || xTable.isUpdateByRow(row, field)) {
                console.log('改变了')
                delete row._XID
                const res = await createAward(row)
                // 局部更新单元格为已保存状态
                if (res) {
                    this.$XModal.message({
                        message: '保存成功',
                        status: 'success'
                    })
                    xTable.reloadRow(row)
                }
            }
        },
        async deleteAwardById (id) {
            const res = await deleteAward(id)
            if (res) {
                this.queryAwardsList()
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
