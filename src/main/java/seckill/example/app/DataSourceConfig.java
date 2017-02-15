package seckill.example.app;

import com.mchange.v2.c3p0.ComboPooledDataSource;
import org.apache.ibatis.session.SqlSessionFactory;
import org.mybatis.spring.SqlSessionFactoryBean;
import org.mybatis.spring.mapper.MapperScannerConfigurer;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;
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
@PropertySource("classpath:application.properties")
public class DataSourceConfig {
    @Value("${driver:}")
    private String driver;
    @Value("${url}")
    private String url;
    @Value("${dataUsername}")
    private String dataUsername;
    @Value("${dataPassword}")
    private String dataPassword;

    @Bean
    public DataSource dataSource()  {
        ComboPooledDataSource ds = new ComboPooledDataSource();
        try {
            ds.setDriverClass("com.mysql.jdbc.Driver");
        } catch (PropertyVetoException e) {
            e.printStackTrace();
        }
        ds.setJdbcUrl("jdbc:mysql://192.168.110.2:3306/seckill?useUnicode=true&characterEncoding=utf-8");
        ds.setUser("root");
        ds.setPassword("toor");
        return  ds;
    }
    //事务管理器
    @Bean
    public DataSourceTransactionManager transactionManager() {
        return new DataSourceTransactionManager(dataSource());

    }

    @Bean(name = "sqlSessionFactory")
    public SqlSessionFactory sqlSessionFactory() throws Exception {
        SqlSessionFactoryBean sessionFactory = new SqlSessionFactoryBean();
        sessionFactory.setDataSource(dataSource());
        //为映射文件的resultType设置别名，package批量设置，默认去除包名的类名为别名
        sessionFactory.setTypeAliasesPackage("seckill.example.entity");
        //添加XML目录
        ResourcePatternResolver resolver = new PathMatchingResourcePatternResolver();
        try {
            sessionFactory.setConfigLocation(resolver.getResource("classpath:mybatis-config.xml"));
            sessionFactory.setMapperLocations(resolver.getResources("classpath:mapper/*.xml"));
        } catch (IOException e) {
            e.printStackTrace();
        }
        return sessionFactory.getObject();
    }
    @Bean
    public MapperScannerConfigurer mapperScannerConfigurer(){

        MapperScannerConfigurer mapperScannerConfigurer = new MapperScannerConfigurer();
        try {
            mapperScannerConfigurer.setSqlSessionFactoryBeanName("sqlSessionFactory");
        } catch (Exception e) {
            e.printStackTrace();
        }
        mapperScannerConfigurer.setBasePackage("seckill.example.dao");
        return  mapperScannerConfigurer;
    }

}
