package seckill.example.app;
import org.springframework.web.servlet.handler.HandlerInterceptorAdapter;

import seckill.example.web.SeckillController;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.web.BasicErrorController;
import org.springframework.web.method.HandlerMethod;
import org.springframework.web.servlet.ModelAndView;
import java.lang.reflect.Method;


public class RequestLog extends HandlerInterceptorAdapter {
	private static final Logger logger = LoggerFactory.getLogger(RequestLog.class);
    /**
     * 前置检查
     */
    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler)
            throws Exception {
        String ip = request.getRemoteAddr();
        long startTime = System.currentTimeMillis();
        request.setAttribute("requestStartTime", startTime);
        HandlerMethod handlerMethod = (HandlerMethod) handler;
        // 获取用户token
        Method method = handlerMethod.getMethod();
        logger.info("用户:"+ip+",访问目标:"+method.getDeclaringClass().getName() + "." + method.getName());
        return true;
    }
    // controller处理完成
    public void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler,
            ModelAndView modelAndView) throws Exception {
        HandlerMethod handlerMethod = (HandlerMethod) handler;
        Method method = handlerMethod.getMethod();
        long startTime = (Long) request.getAttribute("requestStartTime");

        long endTime = System.currentTimeMillis();

        long executeTime = endTime - startTime;

        // log it
        if (executeTime > 1000) {
        	logger.info("[" + method.getDeclaringClass().getName() + "." + method.getName() + "] 执行耗时 : "
                    + executeTime + "ms");
        } else {
        	logger.info("[" + method.getDeclaringClass().getSimpleName() + "." + method.getName() + "] 执行耗时 : "
                    + executeTime + "ms");
        }

    }
}