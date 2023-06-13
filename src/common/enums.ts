/*
* @file enums.ts
* @author kangjianxuan
*/

import { reactive } from "vue";

// 货物类型
export const GOODS_TYPE = [
    {
        label: '粮油及面粉类',
        value: 1
    },
    {
        label: "干货调料类",
        value: 2
    },
    {
        label: "蔬菜水果类",
        value: 3
    },
    {
        label: "肉类",
        value: 4
    },
    {
        label: "河粉",
        value: 5
    },
    {
        label: "牛奶类",
        value: 6
    },
    {
        label: "糕点类",
        value: 7
    },
    {
        label: "其它类",
        value: 0
    }
];

// 二级类型
export const INCOME_TYPE = [
    {
        label: "收入",
        value: 1
    },
    {
        label: "早餐",
        value: 2
    },
    {
        label: "中餐",
        value: 3
    },
    {
        label: "加餐",
        value: 3
    },
    {
        label: "其它类",
        value: 0
    }
];

// 支出类型
export const OUTCOME_TYPE = [
    {
        label:  "大米",
        value: 1
    },
    {
        label: "面粉",
        value: 2
    },
    {
        label: "食用油",
        value: 3
    },
    {
        label: "干货/调味品",
        value: 4
    },
    {
        label: "牛奶",
        value: 5
    },
    {
        label: "肉类",
        value: 6
    },
    {
        label: "鱼类",
        value: 7
    },
    {
        label: "面点类",
        value: 8
    },
    {
        label: "蔬菜",
        value: 9
    },
    {
        label: "燃气",
        value: 10
    },
    {
        label: "水电",
        value: 11
    },
    {
        label: "管理费",
        value: 12
    },
    {
        label: "其他",
        value: 0
    }
];

// 类型
export const DIC_TYPE = reactive({
    type: [
        {
            label: '支出',
            value: 1
        },
        {
            label: "收入",
            value: 0
        }
    ]
});

// 类型
export const TYPE = [
    {
        label: '支出',
        value: 1
    },
    {
        label: "收入",
        value: 0
    }
];

// DIC评价类型
export const DIC_EVALUATE_TYPE = reactive({
    type: [
        {
            label: '特优',
            value: 1,
            type: "success"
        },
        {
            label: '优',
            value: 2
        },
        {
            label: '良',
            value: 3,
            type: "warning"
        },
        {
            label: '差',
            value: 4,
            type: "danger"
        }
    ]
});

// 评价类型
export const EVALUATE_TYPE = [
    {
        label: '特优',
        value: 1
    },
    {
        label: '优',
        value: 2
    },
    {
        label: '良',
        value: 3
    },
    {
        label: '差',
        value: 4
    }
];

