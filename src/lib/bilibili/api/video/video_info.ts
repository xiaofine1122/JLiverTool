import BasicResponse from '../basic_response'

export type GetVideoInfoResponse = BasicResponse & {
  data: {
    bvid: string
    aid: number
    videos: number
    tid: number
    tid_v2: number
    tname: string
    tname_v2: string
    copyright: number
    pic: string
    title: string
    pubdate: number
    ctime: number
    desc: string
    desc_v2: Array<{
      raw_text: string
      type: number
      biz_id: number
    }>
    state: number
    duration: number
    mission_id?: number
    rights: {
      bp: number
      elec: number
      download: number
      movie: number
      pay: number
      hd5: number
      no_reprint: number
      autoplay: number
      ugc_pay: number
      is_cooperation: number
      ugc_pay_preview: number
      no_background: number
      clean_mode: number
      is_stein_gate: number
      is_360: number
      no_share: number
      arc_pay: number
      free_watch: number
    }
    owner: {
      mid: number
      name: string
      face: string
    }
    stat: {
      aid: number
      view: number
      danmaku: number
      reply: number
      favorite: number
      coin: number
      share: number
      now_rank: number
      his_rank: number
      like: number
      dislike: number
      evaluation: string
      vt: number
    }
    argue_info: {
      argue_msg: string
      argue_type: number
      argue_link: string
    }
    dynamic: string
    cid: number
    dimension: {
      width: number
      height: number
      rotate: number
    }
    premiere: any
    teenage_mode: number
    is_chargeable_season: boolean
    is_story: boolean
    is_upower_exclusive: boolean
    is_upower_play: boolean
    is_upower_preview: boolean
    enable_vt: number
    vt_display: string
    is_upower_exclusive_with_qa: boolean
    no_cache: boolean
    pages: Array<{
      cid: number
      page: number
      from: string
      part: string
      duration: number
      vid: string
      weblink: string
      dimension: {
        width: number
        height: number
        rotate: number
      }
    }>
    subtitle: {
      allow_submit: boolean
      list: Array<{
        id: number
        lan: string
        lan_doc: string
        is_lock: boolean
        subtitle_url: string
        type: number
        id_str: string
        ai_type: number
        ai_status: number
        author: {
          mid: number
          name: string
          sex: string
          face: string
          sign: string
          rank: number
          birthday: number
          is_fake_account: number
          is_deleted: number
          in_reg_audit: number
          is_senior_member: number
          name_render: any
        }
      }>
    }
    staff?: Array<{
      mid: number
      title: string
      name: string
      face: string
      vip: {
        type: number
        status: number
        due_date: number
        vip_pay_type: number
        theme_type: number
        label: {
          path: string
          text: string
          label_theme: string
          text_color: string
          bg_style: number
          bg_color: string
          border_color: string
          use_img_label: boolean
          img_label_uri_hans: string
          img_label_uri_hant: string
          img_label_uri_hans_static: string
          img_label_uri_hant_static: string
        }
        avatar_subscript: number
        nickname_color: string
        role: number
        avatar_subscript_url: string
        tv_vip_status: number
        tv_vip_pay_type: number
        tv_due_date: number
        avatar_icon: {
          icon_type: number
          icon_resource: any
        }
      }
      official: {
        role: number
        title: string
        desc: string
        type: number
      }
      follower: number
      label_style: number
    }>
    is_season_display: boolean
    user_garb?: {
      url_image_ani_cut: string
    }
    honor_reply?: {
      honor: Array<{
        aid: number
        type: number
        desc: string
        weekly_recommend_num: number
      }>
    }
    like_icon: string
    need_jump_bv: boolean
    disable_show_up_info: boolean
    is_story_play: number
    is_view_self: boolean
  }
}

export default GetVideoInfoResponse