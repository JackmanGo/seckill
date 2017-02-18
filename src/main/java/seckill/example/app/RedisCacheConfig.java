package seckill.example.app;

import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import seckill.example.dao.cache.RedisCacheDao;

/**
 * Created by wang on 17-2-18.
 */
@Configuration
@EnableAutoConfiguration
public class RedisCacheConfig {
    @Bean
    public RedisCacheDao dataSource()  {
        RedisCacheDao ds = new RedisCacheDao("127.0.0.1",6379);
        return ds;
    }
}
