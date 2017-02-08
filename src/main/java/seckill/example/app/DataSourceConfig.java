package seckill.example.app;

import com.mchange.v2.c3p0.ComboPooledDataSource;
import org.apache.ibatis.session.SqlSessionFactory;
import org.mybatis.spring.SqlSessionFactoryBean;
import org.mybatis.spring.annotation.MapperScan;
import org.mybatis.spring.mapper.MapperScannerConfigurer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;
import org.springframework.core.env.Environment;
import org.springframework.core.io.support.PathMatchingResourcePatternResolver;
import org.springframework.core.io.support.ResourcePatternResolver;
import org.springframework.jdbc.datasource.DataSourceTransactionManager;

import javax.sql.DataSource;
import java.beans.PropertyVetoException;
import java.io.IOException;

/**
 * Created by wang on 17-2-2.
 */
@Configuration
@EnableAutoConfiguration
@PropertySource("classpath:datasource.properties")
@MapperScan(basePackages="seckill.example.dao", sqlSessionFactoryRef = "sqlSessionFactory")
public class DataSourceConfig {
    @Autowired
    private Environment env;
    @Bean
    public DataSource dataSource()  {
        ComboPooledDataSource ds = new ComboPooledDataSource();
        try {
            ds.setDriverClass(env.getProperty("driver"));
        } catch (PropertyVetoException e) {
            e.printStackTrace();
        }
        ds.setJdbcUrl(env.getProperty("url"));
        ds.setUser(env.getProperty("dataUsername"));
        ds.setPassword(env.getProperty("dataPassword"));
        return  ds;
    }

    @Bean
    public DataSourceTransactionManager transactionManager() {
        return new DataSourceTransactionManager(dataSource());

    }

    @Bean(name = "sqlSessionFactory")
    public SqlSessionFactory sqlSessionFactory() throws Exception {
        final SqlSessionFactoryBean sessionFactory = new SqlSessionFactoryBean();
        sessionFactory.setDataSource(dataSource());
        sessionFactory.setTypeAliasesPackage("seckill.example.entry");
        //添加XML目录
        ResourcePatternResolver resolver = new PathMatchingResourcePatternResolver();
        try {
            sessionFactory.setMapperLocations(resolver.getResources("classpath:mapper/*.xml"));
        } catch (IOException e) {
            e.printStackTrace();
        }
        return sessionFactory.getObject();
    }

    @Bean
    public MapperScannerConfigurer mapperScannerConfigurer(){
        MapperScannerConfigurer mapperScannerConfigurer = new MapperScannerConfigurer();
        mapperScannerConfigurer.setSqlSessionFactoryBeanName("sqlSessionFactory");
        mapperScannerConfigurer.setBasePackage("seckill.example.dao");
        return  mapperScannerConfigurer;
    }

}
