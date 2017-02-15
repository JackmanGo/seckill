package seckill.example.web;

import java.util.Date;
import java.util.List;

import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import seckill.example.dto.Exposer;
import seckill.example.dto.SeckillExecution;
import seckill.example.dto.SeckillResult;
import seckill.example.entity.Seckill;
import seckill.example.enums.SeckillStatEnum;
import seckill.example.exception.RepeatKillException;
import seckill.example.exception.SeckillCloseException;
import seckill.example.service.SeckillService;

@RestController
@RequestMapping("/seckill") // url:模块/资源/{}/细分
public class SeckillController {
	private static final Logger logger = LoggerFactory.getLogger(SeckillController.class);
	@Autowired
	private SeckillService seckillService;

	@RequestMapping(value = "/listGoods", method = RequestMethod.GET)
	public List<Seckill> list(HttpServletResponse response) {
		// list.jsp+mode=ModelAndView
		// 获取列表页
		List<Seckill> list = seckillService.getSeckillList();
		response.setHeader("Access-Control-Allow-Origin", "*");
		return list;
	}

	@RequestMapping(value = "/detail/{seckillId}", method = RequestMethod.GET)
	public Seckill detail(@PathVariable("seckillId") Long seckillId, HttpServletResponse response) {
		logger.info("查询的seckillId为"+seckillId);
		logger.debug("test");
		if (seckillId == null) {
			logger.info("seckill为null");
		}

		Seckill seckill = seckillService.getById(seckillId);
		if (seckill == null) {
			logger.info("查询无结果");
		}
		response.setHeader("Access-Control-Allow-Origin", "*");
		return seckill;
	}

	// ajax ,json暴露秒杀接口的方法
	@RequestMapping(value = "/exposer/{seckillId}", method = RequestMethod.POST, produces = {
			"application/json;charset=UTF-8" })
	public SeckillResult<Exposer> exposer(Long seckillId) {
		SeckillResult<Exposer> result;
		try {
			Exposer exposer = seckillService.exportSeckillUrl(seckillId);
			result = new SeckillResult<Exposer>(true, exposer);
		} catch (Exception e) {
			e.printStackTrace();
			result = new SeckillResult<Exposer>(false, e.getMessage());
		}

		return result;
	}

	@RequestMapping(value = "/{seckillId}/{md5}/execution", method = RequestMethod.POST, produces = {
			"application/json;charset=UTF-8" })
	public SeckillResult<SeckillExecution> execute(@PathVariable("seckillId") Long seckillId,
			@PathVariable("md5") String md5, @CookieValue(value = "killPhone", required = false) Long phone) {
		if (phone == null) {
			return new SeckillResult<SeckillExecution>(false, "未注册");
		}
		SeckillResult<SeckillExecution> result;

		try {
			SeckillExecution execution = seckillService.executeSeckill(seckillId, phone, md5);
			return new SeckillResult<SeckillExecution>(true, execution);
		} catch (RepeatKillException e1) {
			SeckillExecution execution = new SeckillExecution(seckillId, SeckillStatEnum.REPEAT_KILL);
			return new SeckillResult<SeckillExecution>(true, execution);
		} catch (SeckillCloseException e2) {
			SeckillExecution execution = new SeckillExecution(seckillId, SeckillStatEnum.END);
			return new SeckillResult<SeckillExecution>(true, execution);
		} catch (Exception e) {
			SeckillExecution execution = new SeckillExecution(seckillId, SeckillStatEnum.INNER_ERROR);
			return new SeckillResult<SeckillExecution>(true, execution);
		}

	}

	// 获取系统时间
	@RequestMapping(value = "/time/now", method = RequestMethod.GET)
	public SeckillResult<Long> time(HttpServletResponse response) {
		Date now = new Date();
		response.setHeader("Access-Control-Allow-Origin", "*");
		return new SeckillResult<Long>(true, now.getTime());
	}
}
