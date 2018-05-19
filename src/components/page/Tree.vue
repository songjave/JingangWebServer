<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-menu"></i> 功能</el-breadcrumb-item>
                <el-breadcrumb-item>层级目录</el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <div class="container">
            <div id="app">
                <tree-menu
                    :nodes="tree.nodes"
                    :depth="0"
                    :label="tree.label"
                ></tree-menu>
            </div>
        </div>
    </div>
</template>
    <script type="text/x-template" id="tree-menu">
      <div class="tree-menu">
        <div class="label-wrapper" @click="toggleChildren">
          <div :style="indent" :class="labelClasses">
            <i v-if="nodes" class="fa" :class="iconClasses"></i>
            {{ label }}
          </div>
        </div>
        <tree-menu
          v-if="showChildren"
          v-for="node in nodes"
          :nodes="node.nodes"
          :label="node.label"
          :depth="depth + 1"
        >
        </tree-menu>
      </div>

    </script>


<script type="text/javascript">
    let tree = {
        label: 'root',
        nodes: [
            {
                label: 'item1',
                nodes: [
                    {
                        label: 'item1.1'
                    },
                    {
                        label: 'item1.2',
                        nodes: [
                            {
                                label: 'item1.2.1'
                            }
                        ]
                    }
                ]
            },
            {
                label: 'item2'
            }
        ]
    };
    new Vue({
        el: '#app',
        data: {
            tree
        }
    });
    Vue.component('tree-menu', {
        template: '#tree-menu',
        props: [ 'nodes', 'label', 'depth' ],
        data() {
            return {
                showChildren: false
            }
        },
        computed: {
            iconClasses() {
                return {
                    'fa-plus-square-o': !this.showChildren,
                    'fa-minus-square-o': this.showChildren
                }
            },
            labelClasses() {
                return { 'has-children': this.nodes }
            },
            indent() {
                return { transform: `translate(${this.depth * 50}px)` }
            }
        },
        methods: {
            toggleChildren() {
                this.showChildren = !this.showChildren;
            }
        }
    });
</script>

<style scoped>
    .container {
        width: 300px;
        margin: 0 auto;
    }
    .tree-menu .label-wrapper {
        padding-bottom: 10px;
        margin-bottom: 10px;
        border-bottom: 1px solid #ccc;
    }
    .tree-menu .has-children {
        cursor: pointer;
    }
</style>
