package seckill.example.app;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;


@SpringBootApplication
@ComponentScan("seckill.example")
public class App extends WebMvcConfigurerAdapter {
	public static void main(String args[]) {
		SpringApplication.run(App.class, args);
	}
											
	// 增加拦截器
	@Override
	public void addInterceptors(InterceptorRegistry registry) {
		registry.addInterceptor(new RequestLog());
	}

}
