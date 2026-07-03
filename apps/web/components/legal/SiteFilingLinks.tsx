/** 对外公示；变更备案时在平台「详情」核对后改此处 */
const SITE_ICP_NUMBER = "浙ICP备2024069715号-2";
const SITE_PSB_RECORD_CODE = "33010902004560";

const filingLinkClass =
  "text-xs text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 underline-offset-2 hover:underline transition-colors";

export function SiteFilingLinks() {
  return (
    <div className="flex flex-col gap-1.5 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-4 sm:gap-y-1">
      <a
        href="https://beian.miit.gov.cn/"
        target="_blank"
        rel="noreferrer"
        className={filingLinkClass}
      >
        {SITE_ICP_NUMBER}
      </a>
      <a
        href={`https://www.beian.gov.cn/portal/registerSystemInfo?recordcode=${SITE_PSB_RECORD_CODE}`}
        target="_blank"
        rel="noreferrer"
        className={`${filingLinkClass} inline-flex items-center gap-1`}
      >
        {/* 公安备案常用公示图标，与全国互联网安全管理服务平台要求一致 */}
        <img
          src="https://www.beian.gov.cn/img/ghs.png"
          alt=""
          width={14}
          height={16}
          className="inline-block opacity-90"
        />
        浙公网安备{SITE_PSB_RECORD_CODE}号
      </a>
    </div>
  );
}
