<template>
    <div class="home">
        <vxe-form :data="formData" @submit="findList">
            <vxe-form-item title="姓名" field="name">
                <template v-slot>
                    <vxe-input v-model="formData.name" placeholder="请输入姓名"></vxe-input>
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
            ref="WinlistTable"
            border
            resizable
            keep-source
            :loading="loading"
            :data="tableData"
        >
            <vxe-table-column type="seq" width="60"></vxe-table-column>
            <vxe-table-column field="name" title="姓名"></vxe-table-column>
            <vxe-table-column field="jobNumber" title="工号"></vxe-table-column>
            <vxe-table-column field="award" title="奖项名称"></vxe-table-column>
            <vxe-table-column field="level" title="奖项等级"></vxe-table-column>
            <vxe-table-column title="操作">
                <template v-slot="{ row }">
                    <div class="cz">
                        <i @click="deleteWinlistById(row.id)" class="el-icon-delete"></i>
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
import { queryWinlists, deleteWinlist } from '@/service/pageAjax'
export default {
    name: 'Winlist',
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
            tableData: []
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
            this.queryWinlistsList(params)
        },
        async queryWinlistsList (params = {}) {
            console.log(params)
            const res = await queryWinlists(params)
            console.log(res)
            if (res) {
                this.tableData = res
                this.loading = false
            }
        },
        async deleteWinlistById (id) {
            const res = await deleteWinlist(id)
            if (res) {
                this.queryWinlistsList()
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
