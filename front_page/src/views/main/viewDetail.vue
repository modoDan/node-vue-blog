<template>
    <div v-if="showView" class="view-box">
        <div class="panel panel-default">
            <div class="panel-body">
                <h2>{{content.title}}</h2>
                <p>
                    作者：<span>{{content.user?content.user.username:'无'}}</span>
                    时间：<span>{{$formatDate(content.addTime)}}</span>
                    阅读：<span>{{content.views}}</span>
                    评论：<span>{{content.comments.length}}</span>
                </p>
                <dfn>
                    <p>{{content.content}}</p>
                </dfn>
            </div>
        </div>
        <div class="panel panel-default">
            <div class="panel-body">
                <h3 class="comment-title"><strong>评论</strong><span>一共有<em id="messageCount" class="comment-num">{{comments.length}}</em>条评论</span></h3>
                <p><input type="hidden" id="contentId" v-model="content._id"></p>
                <div class="user-status">
                    <div v-if="userInfo._id">
                        <p>魔豆</p>
                        <p class="login-status">
                            <textarea name="messageContent" id="messageContent" rows="5" v-model="commentValue"></textarea>
                            <button id="messageBtn" @click="commentBtn(content._id)">评论</button>
                        </p>
                    </div>
                    <p class="logout-status" v-else>你还没有登录，请先登录！</p>
                </div>
                <div class="messageList">
                    <div class="messageBox" v-for="comment in preComments">
                        <p class="name">
                            <span>
                          {{comment.username}}
                      </span>
                            <span>
                           {{comment.postTime}}
                      </span>
                        </p>
                        <p class="comments">
                            {{comment.content}}
                        </p>
                    </div>
                    <div class="messageBox" v-if="!content.comments.length">
                        <p>还没有评论！</p>
                    </div>
                </div>
            </div>
        </div>
        <div class="panel panel-default" v-show="content.comments.length>0">
            <nav aria-label="...">
                <ul class="pager">
                    <li class="previous"><a href="#" @click="renderComment(page-1)">&larr;上一页</a></li>
                    <li><strong>{{page}}/{{pages}}</strong></li>
                    <li class="next"><a href="#" @click="renderComment(page+1)">&rarr;下一页</a></li>
                </ul>
            </nav>
        </div>
    </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { VIEW } from '../../apis/main.js'
import { GETCOMMENT, POSTCOMMENT } from '../../apis/api.js'
export default {
    data() {
        return {
            content: {},
            comments: [],
            preComments: [],
            category: '',
            page: 1,
            prepage: 2,
            pages: 0,
            showView: false,
            commentValue: ''
        }
    },
    props: ['query'],
    computed: {
        ...mapGetters([
            'userInfo'
        ])
    },
    created() {
        this.init()
    },
    methods: {
        async init() {
            let view_info = await VIEW({
                contentid: this.query.contentid,
                category: this.query.category
            });
            this.showView = true
            let { content, category } = view_info
            this.content = content
            this.category = category
            //获取全文信息后再调评论接口
            let comment_info = await GETCOMMENT({
                contentid: this.query.contentid
            })
            this.comments = comment_info.data.reverse()
            let len = this.comments.length;
            this.pages = Math.max(Math.ceil(len / this.prepage), 1);
            let end = Math.min(this.prepage, len);
            for (let i = 0; i < end; i++) {
                this.preComments.push(this.comments[i])
            }
        },
        async commentBtn(contentid) {
            let comment_newinfo = await POSTCOMMENT({
                contentid: contentid,
                content: this.commentValue
            })
            if (!comment_newinfo.code) {
                this.preComments = [];
                this.page = 1;
                this.commentValue = '';
                this.content = comment_newinfo.data;
                this.comments = this.content.comments.reverse();
                let len = this.comments.length;
                this.pages = Math.max(Math.ceil(len / this.prepage), 1);
                let end = Math.min(this.prepage, len);
                for (let i = 0; i < len; i++) {
                    this.preComments.push(this.comments[i])
                }
            }
        },
        renderComment(page) {
            let len = this.comments.length;
            if (0 < page && page <= this.pages) {
                this.preComments = [];
                let start = Math.max(0, (page - 1) * this.prepage);
                let end = Math.min(start + this.prepage, len);
                for (let i = start; i < end; i++) {
                    this.preComments.push(this.comments[i])
                }
                this.page = page;
            }
        }
    }
}
</script>
<style>
</style>