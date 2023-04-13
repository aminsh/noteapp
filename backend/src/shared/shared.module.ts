import { Global, Module } from '@nestjs/common';
import { RequestContext } from './service/request-context';

@Global()
@Module({
  providers: [
    RequestContext
  ],
  exports: [
    RequestContext
  ]
})
export class SharedModule {
}
